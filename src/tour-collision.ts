import type { Entity, Mesh, MeshInstance, ModelComponent, RenderComponent } from 'playcanvas';
import { BoundingBox, Mat4, PRIMITIVE_TRIANGLES, Ray, Tri, Vec3 } from 'playcanvas';

type TriBucket = {
  /** World-space bounds of this mesh instance's triangles. */
  aabb: BoundingBox;
  tris: Float32Array;
};

const tv0 = new Vec3();
const tv1 = new Vec3();
const tv2 = new Vec3();
const te1 = new Vec3();
const te2 = new Vec3();
const tN = new Vec3();
const hit = new Vec3();
const tmpRay = new Ray();
const tmpTri = new Tri();

const MAX_FLOOR_CEILING_NY = 0.55;

function gatherMeshInstances(root: Entity): MeshInstance[] {
  const out: MeshInstance[] = [];
  const renders = root.findComponents('render') as unknown as RenderComponent[];
  for (const r of renders) {
    const mis = r.meshInstances;
    if (mis) {
      for (const mi of mis) out.push(mi);
    }
  }
  const models = root.findComponents('model') as unknown as ModelComponent[];
  for (const m of models) {
    const mis = m.meshInstances;
    if (mis) {
      for (const mi of mis) out.push(mi);
    }
  }
  return out;
}

function transformPoint(worldMat: Mat4, x: number, y: number, z: number, out: Vec3): void {
  tv0.set(x, y, z);
  worldMat.transformPoint(tv0, out);
}

function pushTri(
  worldMat: Mat4,
  ax: number,
  ay: number,
  az: number,
  bx: number,
  by: number,
  bz: number,
  cx: number,
  cy: number,
  cz: number,
  dst: number[]
): void {
  transformPoint(worldMat, ax, ay, az, tv0);
  transformPoint(worldMat, bx, by, bz, tv1);
  transformPoint(worldMat, cx, cy, cz, tv2);
  dst.push(tv0.x, tv0.y, tv0.z, tv1.x, tv1.y, tv1.z, tv2.x, tv2.y, tv2.z);
}

function meshWorldTriangles(mesh: Mesh, worldMat: Mat4, out: number[]): void {
  const vb = mesh.vertexBuffer;
  if (!vb) return;

  const numVerts = vb.numVertices;
  const localPos = new Float32Array(numVerts * 3);
  const got = mesh.getPositions(localPos);
  if (got < 3) return;

  const ib0 = mesh.indexBuffer[0];
  const ni = ib0?.numIndices ?? 0;
  const indices = new Uint32Array(Math.max(ni, 3));
  const numIndices = mesh.getIndices(indices);

  for (const prim of mesh.primitive) {
    if (prim.type !== PRIMITIVE_TRIANGLES) continue;

    const indexed = prim.indexed !== false && numIndices >= 3;

    if (!indexed) {
      const baseV = prim.baseVertex ?? 0;
      const from = prim.base;
      const to = prim.base + prim.count;
      for (let i = from; i + 2 < to; i += 3) {
        const i0 = (baseV + i) * 3;
        const i1 = (baseV + i + 1) * 3;
        const i2 = (baseV + i + 2) * 3;
        pushTri(
          worldMat,
          localPos[i0],
          localPos[i0 + 1],
          localPos[i0 + 2],
          localPos[i1],
          localPos[i1 + 1],
          localPos[i1 + 2],
          localPos[i2],
          localPos[i2 + 1],
          localPos[i2 + 2],
          out
        );
      }
      continue;
    }

    const from = prim.base;
    const to = prim.base + prim.count;
    for (let i = from; i + 2 < to; i += 3) {
      const a = indices[i] * 3;
      const b = indices[i + 1] * 3;
      const c = indices[i + 2] * 3;
      pushTri(
        worldMat,
        localPos[a],
        localPos[a + 1],
        localPos[a + 2],
        localPos[b],
        localPos[b + 1],
        localPos[b + 2],
        localPos[c],
        localPos[c + 1],
        localPos[c + 2],
        out
      );
    }
  }
}

export class SceneCollision {
  private readonly buckets: TriBucket[];

  private constructor(buckets: TriBucket[]) {
    this.buckets = buckets;
  }

  static fromEntity(root: Entity): SceneCollision | null {
    const mis = gatherMeshInstances(root);
    if (mis.length === 0) return null;

    const buckets: TriBucket[] = [];
    const worldMat = new Mat4();
    const tmp: number[] = [];

    for (const mi of mis) {
      const mesh: Mesh | undefined = mi.mesh;
      if (!mesh) continue;
      tmp.length = 0;
      worldMat.copy(mi.node.getWorldTransform());
      meshWorldTriangles(mesh, worldMat, tmp);
      if (tmp.length < 9) continue;

      const aabb = mi.aabb ? mi.aabb.clone() : new BoundingBox();
      if (!mi.aabb) {
        const mn = new Vec3(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);
        const mx = new Vec3(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY);
        for (let i = 0; i < tmp.length; i += 3) {
          mn.x = Math.min(mn.x, tmp[i]);
          mn.y = Math.min(mn.y, tmp[i + 1]);
          mn.z = Math.min(mn.z, tmp[i + 2]);
          mx.x = Math.max(mx.x, tmp[i]);
          mx.y = Math.max(mx.y, tmp[i + 1]);
          mx.z = Math.max(mx.z, tmp[i + 2]);
        }
        aabb.setMinMax(mn, mx);
      }

      buckets.push({ aabb, tris: new Float32Array(tmp) });
    }

    if (buckets.length === 0) return null;
    return new SceneCollision(buckets);
  }

  castWalk(origin: Vec3, dirX: number, dirZ: number, maxDist: number): number {
    const len = Math.hypot(dirX, dirZ);
    if (len < 1e-6 || maxDist < 1e-6) return maxDist;

    const dx = dirX / len;
    const dz = dirZ / len;
    tmpRay.origin.copy(origin);
    tmpRay.direction.set(dx, 0, dz);

    let bestT = maxDist;

    for (const b of this.buckets) {
      if (!b.aabb.intersectsRay(tmpRay)) continue;

      const data = b.tris;
      const triCount = data.length / 9;
      for (let t = 0; t < triCount; t++) {
        const o = t * 9;
        tv0.set(data[o], data[o + 1], data[o + 2]);
        tv1.set(data[o + 3], data[o + 4], data[o + 5]);
        tv2.set(data[o + 6], data[o + 7], data[o + 8]);

        te1.sub2(tv1, tv0);
        te2.sub2(tv2, tv0);
        tN.cross(te1, te2);
        if (tN.lengthSq() < 1e-12) continue;
        tN.normalize();
        if (Math.abs(tN.y) > MAX_FLOOR_CEILING_NY) continue;

        tmpTri.set(tv0, tv1, tv2);
        if (!tmpTri.intersectsRay(tmpRay, hit)) continue;

        const along = (hit.x - origin.x) * dx + (hit.z - origin.z) * dz;
        if (along > 1e-3 && along < bestT) bestT = along;
      }
    }

    return bestT;
  }
}
