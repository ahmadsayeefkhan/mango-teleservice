/**
 * GLSL for the network globe. Every fragment shader ends with
 * `#include <colorspace_fragment>` so colours are correct both when rendering
 * straight to the canvas and when going through the post-processing composer.
 */

/* ------------------------------------------------------------------ ocean */

export const globeVert = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vView = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;

export const globeFrag = /* glsl */ `
  uniform vec3 uOceanDark;
  uniform vec3 uOceanLight;
  uniform vec3 uRim;
  uniform vec3 uMango;
  uniform vec3 uSunDir;
  uniform float uRimStrength;
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    float ndv = max(dot(vNormal, vView), 0.0);
    float fres = pow(1.0 - ndv, 3.2);
    float sun = dot(vNormal, normalize(uSunDir)) * 0.5 + 0.5;
    vec3 col = mix(uOceanDark, uOceanLight, sun * 0.6);
    // cool rim, with a whisper of warmth on the sun-facing terminator
    vec3 rim = mix(uRim, uMango, 0.22 * smoothstep(0.55, 1.0, sun));
    col += rim * fres * uRimStrength;
    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
  }
`;

/* ------------------------------------------------------- atmosphere halo */

export const haloVert = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const haloFrag = /* glsl */ `
  uniform vec3 uRim;
  uniform vec3 uMango;
  uniform float uInner;   // projected silhouette radius on the billboard (world units)
  uniform float uSize;    // billboard half-size (world units)
  uniform float uStrength;
  varying vec2 vUv;
  void main() {
    vec2 p = (vUv - 0.5) * 2.0 * uSize;
    float r = length(p);
    float d = max(r - uInner, 0.0);
    // tight rim: bright within ~3% of the radius, gone by ~20%
    float glow = exp(-d * 34.0) * 0.8 + exp(-d * 12.0) * 0.2;
    glow *= 1.0 - smoothstep(0.12, 0.24, d);
    // warm the upper-right quadrant very slightly (sun side)
    float warm = smoothstep(-0.2, 1.0, normalize(p).x * 0.5 + normalize(p).y * 0.5);
    vec3 col = mix(uRim, uMango, 0.16 * warm);
    float a = glow * uStrength * step(uInner * 0.98, r);
    gl_FragColor = vec4(col * a, a);
    #include <colorspace_fragment>
  }
`;

/* ------------------------------------------------------------- land dots */

export const dotsVert = /* glsl */ `
  attribute float aFlag;
  uniform float uTime;
  uniform float uSize;      // pixel size at reference distance (already × dpr)
  uniform float uRefDist;
  uniform vec3 uDhakaDir;   // object space
  uniform float uEmphasis;  // 0..1 South-Asia brightening
  varying float vAlpha;
  varying float vFlag;
  varying float vBoost;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vec3 n = normalize(normalMatrix * position);
    float facing = dot(n, normalize(-mv.xyz));
    float limb = smoothstep(0.02, 0.42, facing);
    float ang = acos(clamp(dot(normalize(position), uDhakaDir), -1.0, 1.0));
    float prox = 1.0 - smoothstep(0.12, 1.15, ang);
    float breathe = 0.5 + 0.5 * sin(uTime * 1.4 + ang * 9.0);
    vBoost = prox * uEmphasis;
    vAlpha = limb * mix(0.30, 0.78, vBoost);
    vFlag = aFlag;
    float pulse = aFlag > 0.5 ? (0.92 + 0.12 * breathe) : 1.0;
    gl_PointSize = uSize * (1.0 + 0.30 * vBoost + 0.08 * aFlag) * pulse * (uRefDist / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;

export const dotsFrag = /* glsl */ `
  uniform vec3 uMist;
  uniform vec3 uMango;
  varying float vAlpha;
  varying float vFlag;
  varying float vBoost;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    float disc = 1.0 - smoothstep(0.30, 0.5, d);
    if (disc < 0.02) discard;
    vec3 col = mix(uMist, uMango, vFlag);
    float alpha = disc * mix(vAlpha, 0.78, vFlag);
    // Bangladesh dots sit just above the bloom threshold: a warm glow, not a blob
    col *= 1.0 + vFlag * 0.18 + vBoost * 0.15;
    gl_FragColor = vec4(col, alpha);
    #include <colorspace_fragment>
  }
`;

/* ------------------------------------------------------------------ arcs */

export const arcVert = /* glsl */ `
  attribute float aArc;
  varying float vT;
  varying float vArc;
  varying vec3 vN;
  varying vec3 vV;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vT = uv.x;
    vArc = aArc;
    vN = normalize(normalMatrix * normal);
    vV = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;

export const arcFrag = /* glsl */ `
  #define MAX_ARCS 8
  uniform float uDraw[MAX_ARCS];
  uniform float uTime;
  uniform vec3 uMango;
  uniform float uPulse;   // 0 = frozen (static mode)
  varying float vT;
  varying float vArc;
  varying vec3 vN;
  varying vec3 vV;
  void main() {
    int idx = int(vArc + 0.5);
    float draw = uDraw[idx];
    if (vT > draw) discard;
    // soft tube: bright core, feathered edge (reads as a glowing line, not a cylinder)
    float edge = pow(max(dot(normalize(vN), normalize(vV)), 0.0), 1.6);
    // draw-in head
    float head = exp(-pow((draw - vT) * 26.0, 2.0)) * (1.0 - step(0.999, draw));
    // travelling signal: alternate direction per arc, short bright head with a decaying tail
    float dir = mod(vArc, 2.0) < 1.0 ? 1.0 : -1.0;
    float speed = 0.11 + 0.025 * mod(vArc * 1.7, 3.0);
    float phase = fract(vArc * 0.381966);
    float p = fract(dir * uTime * speed * uPulse + phase);
    float dd = (vT - p) * dir;
    float pulse = step(dd, 0.0) * step(-0.18, dd) * exp(dd * 18.0);
    pulse *= uPulse + (1.0 - uPulse) * 0.6;
    // ends fade so arcs melt into the beacon and the destination nodes
    float ends = smoothstep(0.0, 0.05, vT) * smoothstep(1.0, 0.94, vT) * 0.75 + 0.25;
    float inten = 0.42 + pulse * 1.5 + head * 1.6;
    float alpha = edge * (0.62 + pulse * 0.38) * ends;
    gl_FragColor = vec4(uMango * inten, alpha);
    #include <colorspace_fragment>
  }
`;

/* ----------------------------------------------------------- Dhaka beacon */

export const beaconVert = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const beaconFrag = /* glsl */ `
  uniform float uTime;
  uniform vec3 uMango;
  uniform float uIntro;   // 0..1 fade-in
  varying vec2 vUv;
  void main() {
    vec2 c = (vUv - 0.5) * 2.0;
    float r = length(c);
    float core = exp(-r * r * 180.0);
    float halo = exp(-r * r * 12.0) * 0.28 + exp(-r * r * 3.0) * 0.07;
    float rings = 0.0;
    for (int i = 0; i < 3; i++) {
      float ph = fract(uTime * 0.22 + float(i) / 3.0);
      float rr = 0.06 + ph * 0.86;
      float w = 0.010 + ph * 0.028;
      float fade = (1.0 - ph) * (1.0 - ph);
      rings += exp(-pow((r - rr) / w, 2.0)) * fade * 0.9;
    }
    float a = (core * 1.2 + halo + rings * 0.8) * uIntro;
    vec3 col = uMango * (1.0 + core * 1.0 + rings * 0.3);
    gl_FragColor = vec4(col * a, a);
    #include <colorspace_fragment>
  }
`;

/* ------------------------------------------------------ destination nodes */

export const nodeVert = /* glsl */ `
  #define MAX_ARCS 8
  attribute float aIndex;
  uniform float uDraw[MAX_ARCS];
  uniform float uSize;
  uniform float uRefDist;
  varying float vAlpha;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vec3 n = normalize(normalMatrix * position);
    float facing = dot(n, normalize(-mv.xyz));
    float limb = smoothstep(0.0, 0.3, facing);
    float d = uDraw[int(aIndex + 0.5)];
    vAlpha = limb * smoothstep(0.86, 1.0, d);
    gl_PointSize = uSize * (uRefDist / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;

export const nodeFrag = /* glsl */ `
  uniform vec3 uMango;
  varying float vAlpha;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float r = length(c) * 2.0;
    float core = 1.0 - smoothstep(0.16, 0.30, r);
    float ring = exp(-pow((r - 0.55) / 0.06, 2.0)) * 0.55;
    float halo = exp(-r * r * 4.0) * 0.35;
    float a = (core + ring + halo) * vAlpha;
    if (a < 0.01) discard;
    gl_FragColor = vec4(uMango * (1.0 + core * 0.8) * a, a);
    #include <colorspace_fragment>
  }
`;
