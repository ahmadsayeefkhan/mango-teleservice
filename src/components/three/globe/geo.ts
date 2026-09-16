import * as THREE from "three";

const DEG = Math.PI / 180;

/** lat/lon (degrees) → unit vector. lon 0° faces +Z, lon 90°E faces +X, north is +Y. */
export function latLonToVec3(lat: number, lon: number, radius = 1, out = new THREE.Vector3()) {
  const phi = lat * DEG;
  const theta = lon * DEG;
  const c = Math.cos(phi);
  return out.set(c * Math.sin(theta) * radius, Math.sin(phi) * radius, c * Math.cos(theta) * radius);
}

/**
 * Great-circle arc between two surface points, lifted above the sphere with a sine
 * profile. Lift scales with the angular distance so short hops stay low and
 * intercontinental routes rise into a clean, readable curve.
 */
export class GreatArcCurve extends THREE.Curve<THREE.Vector3> {
  private readonly a: THREE.Vector3;
  private readonly b: THREE.Vector3;
  private readonly angle: number;
  private readonly lift: number;
  private readonly radius: number;

  constructor(a: THREE.Vector3, b: THREE.Vector3, radius = 1) {
    super();
    this.a = a.clone().normalize();
    this.b = b.clone().normalize();
    this.angle = this.a.angleTo(this.b);
    // ~0.04 R for neighbours (Kolkata) → ~0.17 R for Europe.
    this.lift = radius * (0.04 + 0.2 * Math.min(this.angle / Math.PI, 1) ** 0.8);
    this.radius = radius;
  }

  getPoint(t: number, target = new THREE.Vector3()) {
    const sinA = Math.sin(this.angle);
    if (sinA < 1e-6) return target.copy(this.a).multiplyScalar(this.radius);
    const wa = Math.sin((1 - t) * this.angle) / sinA;
    const wb = Math.sin(t * this.angle) / sinA;
    target.set(
      this.a.x * wa + this.b.x * wb,
      this.a.y * wa + this.b.y * wb,
      this.a.z * wa + this.b.z * wb,
    );
    const h = this.radius + Math.sin(t * Math.PI) * this.lift;
    return target.normalize().multiplyScalar(h);
  }
}

/** Ease used for arc draw-in (power3.out). */
export const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3);

export const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
