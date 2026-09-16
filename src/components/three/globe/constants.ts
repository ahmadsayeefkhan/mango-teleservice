/** Brand tokens used inside the WebGL scene (kept in sync with BUILD_BRIEF §3). */
export const COLORS = {
  mango: "#FECA26",
  mist: "#9AA3AF",
  ink: "#0E1116",
  /** Ocean: a hair bluer than ink so the sphere reads against the ink section. */
  oceanDark: "#0A111A",
  oceanLight: "#121D2D",
  /** Cool blue-white atmosphere rim. */
  rim: "#7FA6E8",
} as const;

export const DHAKA = { name: "Dhaka", lat: 23.8103, lon: 90.4125 } as const;

export type Route = {
  name: string;
  lat: number;
  lon: number;
  /** Which network story this arc belongs to (drives stagger order + label). */
  kind: "subsea" | "terrestrial" | "hub";
  /** Only drawn in the "network" variant. */
  networkOnly?: boolean;
  /** Which side of the node the label sits on (avoids Dhaka/Kolkata collisions). */
  labelSide?: "left" | "right";
};

/**
 * Real Mango connectivity, expressed as destinations from Dhaka.
 * Order = draw-in order on first load (near first, then the long hauls).
 */
export const ROUTES: Route[] = [
  { name: "Kolkata", lat: 22.5726, lon: 88.3639, kind: "terrestrial", labelSide: "left" },
  { name: "Chennai", lat: 13.0827, lon: 80.2707, kind: "subsea", labelSide: "left" },
  { name: "Singapore", lat: 1.3521, lon: 103.8198, kind: "subsea" },
  { name: "Mumbai", lat: 19.076, lon: 72.8777, kind: "subsea", labelSide: "left" },
  { name: "Hong Kong", lat: 22.3193, lon: 114.1694, kind: "hub" },
  { name: "Marseille", lat: 43.2965, lon: 5.3698, kind: "subsea", labelSide: "left" },
  { name: "Frankfurt", lat: 50.1109, lon: 8.6821, kind: "hub" },
  { name: "London", lat: 51.5074, lon: -0.1278, kind: "hub", labelSide: "left" },
];

export const MAX_ARCS = 8;

/** Lat step (degrees) of each dataset; used to size dots relative to their spacing. */
export const DATASETS = {
  full: { url: "/data/land-dots.bin", stepDeg: 0.72 },
  lite: { url: "/data/land-dots-lite.bin", stepDeg: 1.15 },
} as const;

export const FALLBACK_IMAGE = "/images/hero-network-globe.png";
