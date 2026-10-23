export const lerp = (a, b, t) => a + (b - a) * t;

// Palette definitions across the deep-time chapters
export const ERA_CONFIGS = [
  // Era 0: The Stelliferous Dawn (Lush magenta, cyan, violet, and molten gold core)
  {
    speed: 0.32,
    radiusMult: 1.0,
    holeScale: 0.001,
    core: [1.0, 0.92, 0.75],     // Molten white-gold
    mid: [0.85, 0.18, 0.95],     // Electric magenta / violet
    outer: [0.15, 0.82, 1.0],    // Radiant cyan
    gasOpacity: 0.35,
    gasSize: 0.55
  },
  // Era 1: The Last Ember (Smoldering ruby, burnt copper, and dim crimson)
  {
    speed: 0.12,
    radiusMult: 0.88,
    holeScale: 0.08,
    core: [1.0, 0.45, 0.15],     // Blazing ember
    mid: [0.85, 0.18, 0.08],     // Deep ruby crimson
    outer: [0.35, 0.08, 0.12],   // Dying ash
    gasOpacity: 0.22,
    gasSize: 0.45
  },
  // Era 2: The Feast of Giants (Ultraviolet accretion vortex and photon ring)
  {
    speed: 1.45,
    radiusMult: 0.42,
    holeScale: 1.0,
    core: [1.0, 1.0, 1.0],       // Blinding white photon ring
    mid: [0.65, 0.25, 1.0],      // Neon purple / violet
    outer: [0.10, 0.90, 1.0],    // Accretion blue
    gasOpacity: 0.42,
    gasSize: 0.38
  },
  // Era 3: The Silent Whisper (Faint cold sapphire dust in dark space)
  {
    speed: 0.015,
    radiusMult: 1.95,
    holeScale: 0.001,
    core: [0.42, 0.55, 0.78],    // Distant ghostly blue
    mid: [0.28, 0.38, 0.58],     // Deep cold navy
    outer: [0.16, 0.23, 0.38],   // Faint scattered starlight
    gasOpacity: 0.08,
    gasSize: 0.65
  }
];

export function getCosmicColors(progress) {
  const p = Math.max(0, Math.min(3, progress));
  const idxA = Math.min(Math.floor(p), 2);
  const idxB = idxA + 1;
  const t = p - idxA;

  const cfgA = ERA_CONFIGS[idxA];
  const cfgB = ERA_CONFIGS[idxB];

  const core = [
    lerp(cfgA.core[0], cfgB.core[0], t),
    lerp(cfgA.core[1], cfgB.core[1], t),
    lerp(cfgA.core[2], cfgB.core[2], t)
  ];

  const mid = [
    lerp(cfgA.mid[0], cfgB.mid[0], t),
    lerp(cfgA.mid[1], cfgB.mid[1], t),
    lerp(cfgA.mid[2], cfgB.mid[2], t)
  ];

  const outer = [
    lerp(cfgA.outer[0], cfgB.outer[0], t),
    lerp(cfgA.outer[1], cfgB.outer[1], t),
    lerp(cfgA.outer[2], cfgB.outer[2], t)
  ];

  // In CosmicCanvas, gas uses midR, midG, outB:
  const gas = [
    mid[0],
    mid[1],
    outer[2]
  ];

  const toRgb = (arr) => [
    Math.round(Math.max(0, Math.min(1, arr[0])) * 255),
    Math.round(Math.max(0, Math.min(1, arr[1])) * 255),
    Math.round(Math.max(0, Math.min(1, arr[2])) * 255)
  ];

  const coreRgb = toRgb(core);
  const midRgb = toRgb(mid);
  const outerRgb = toRgb(outer);
  const gasRgb = toRgb(gas);

  return {
    core,
    mid,
    outer,
    gas,
    coreRgb,
    midRgb,
    outerRgb,
    gasRgb,
    primaryRgba: (a = 1) => `rgba(${gasRgb[0]}, ${gasRgb[1]}, ${gasRgb[2]}, ${a})`,
    secondaryRgba: (a = 1) => `rgba(${midRgb[0]}, ${midRgb[1]}, ${midRgb[2]}, ${a})`,
    accentRgba: (a = 1) => `rgba(${coreRgb[0]}, ${coreRgb[1]}, ${coreRgb[2]}, ${a})`,
    outerRgba: (a = 1) => `rgba(${outerRgb[0]}, ${outerRgb[1]}, ${outerRgb[2]}, ${a})`,
  };
}