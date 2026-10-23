export const PRESET_PHENOMENA = [
  {
    id: 'deep-time',
    name: 'The Last Light',
    subtitle: 'Continuous Cosmic Deep Time',
    simulationType: 'galaxy',
    chapters: [
      {
        tag: "10⁰ – 10¹⁰ Years",
        title: "Chapter I: The Stelliferous Dawn",
        subtitle: "The Age of Starlight & Creation",
        summary: "Galaxies ignite. Heavy elements forge in stellar cores, and conscious life awakens to gaze upon a bright, dynamic sky."
      },
      {
        tag: "10¹¹ – 10¹⁴ Years",
        title: "Chapter II: The Last Ember",
        subtitle: "The Degenerate Era",
        summary: "Star birth ceases across all galaxies. The sky turns dark, illuminated only by cooling white dwarfs and dead neutron stars."
      },
      {
        tag: "10¹⁵ – 10⁴⁰ Years",
        title: "Chapter III: The Feast of Giants",
        subtitle: "The Black Hole Era",
        summary: "Protons decay into scattered radiation. Only supermassive black holes survive, slowly feeding in the vast, empty dark."
      },
      {
        tag: "10⁴¹ – 10¹⁰⁰+ Years",
        title: "Chapter IV: The Silent Whisper",
        subtitle: "The Final Heat Death",
        summary: "A final cosmic burst marks the black hole's evaporation. Stellar remnants drift outward into the dark; usable free energy is exhausted and cosmic change fades."
      }
    ],
    palettes: [
      { core: [1.0, 0.92, 0.75], mid: [0.85, 0.18, 0.95], outer: [0.15, 0.82, 1.0], gasOpacity: 0.35, speed: 0.32, radiusMult: 1.0, holeScale: 0.001 },
      { core: [1.0, 0.45, 0.15], mid: [0.85, 0.18, 0.08], outer: [0.35, 0.08, 0.12], gasOpacity: 0.22, speed: 0.12, radiusMult: 0.88, holeScale: 0.08 },
      { core: [1.0, 1.0, 1.0], mid: [0.65, 0.25, 1.0], outer: [0.10, 0.90, 1.0], gasOpacity: 0.42, speed: 1.45, radiusMult: 0.42, holeScale: 1.0 },
      { core: [0.42, 0.55, 0.78], mid: [0.28, 0.38, 0.58], outer: [0.16, 0.23, 0.38], gasOpacity: 0.08, speed: 0.015, radiusMult: 1.95, holeScale: 0.001 }
    ],
    energyLabel: "Thermodynamic Free Energy",
    timelineLabel: "Deep-Time Epoch Scrubber",
    stages: ["Dawn (10¹⁰)", "Embers (10¹⁴)", "Giants (10⁴⁰)", "Heat Death (10¹⁰⁰)"]
  },
  {
    id: 'supernova',
    name: 'Supernova Core Collapse',
    subtitle: 'Stellar Detonation & Pulsar Remnant',
    simulationType: 'supernova',
    chapters: [
      {
        tag: "T - 100 Days",
        title: "Stage I: Silicon-Burning Supergiant",
        subtitle: "Hydrodynamic Core Instability",
        summary: "The blue-white supergiant consumes its remaining silicon fuel. Inward gravitational crushing rapidly overtakes radiation pressure."
      },
      {
        tag: "T = 0.00 Seconds",
        title: "Stage II: Core Collapse & Shock Breakout",
        subtitle: "Relativistic Neutrino Burst",
        summary: "The core collapses into degenerate nuclear matter in milliseconds. A colossal hydrodynamic shockwave tears outward through the stellar envelope."
      },
      {
        tag: "T + 1 Year",
        title: "Stage III: Expanding Ejecta Shell",
        subtitle: "Nucleosynthetic Blast Filaments",
        summary: "Glowing shells of synthesized gold, titanium, and oxygen expand at 15,000 km/s into interstellar space, sculpting high-velocity filamentary ribbons."
      },
      {
        tag: "T + 10,000 Years",
        title: "Stage IV: Pulsar Wind Nebula",
        subtitle: "High-Energy Magnetic Magnetar",
        summary: "The shockwave expands into an ethereal multi-light-year nebula. At the center, a newborn rapidly spinning pulsar beams relativistic lighthouse jets into the cosmos."
      }
    ],
    palettes: [
      { core: [0.75, 0.92, 1.0], mid: [0.25, 0.55, 0.95], outer: [0.12, 0.22, 0.65], gasOpacity: 0.45, speed: 0.45, radiusMult: 0.95, holeScale: 0.0 },
      { core: [1.0, 1.0, 0.95], mid: [1.0, 0.72, 0.2], outer: [1.0, 0.28, 0.05], gasOpacity: 0.85, speed: 2.2, radiusMult: 1.4, holeScale: 0.1 },
      { core: [1.0, 0.35, 0.12], mid: [0.92, 0.18, 0.65], outer: [0.15, 0.78, 0.95], gasOpacity: 0.5, speed: 1.1, radiusMult: 1.85, holeScale: 0.25 },
      { core: [0.55, 0.9, 1.0], mid: [0.72, 0.25, 0.95], outer: [0.15, 0.65, 0.45], gasOpacity: 0.32, speed: 0.28, radiusMult: 2.2, holeScale: 0.15 }
    ],
    energyLabel: "Shockwave Relativistic Kinetic Flux",
    timelineLabel: "Detonation Timeline Scrubber",
    stages: ["Pre-Collapse", "Shock Breakout", "Expanding Shell", "Pulsar Nebula"]
  },
  {
    id: 'binary-black-hole',
    name: 'Binary Black Hole Merger',
    subtitle: 'Relativistic Inspiral & Spacetime Ripples',
    simulationType: 'binary_black_hole',
    chapters: [
      {
        tag: "Phase I: Stable Inspiral",
        title: "Relativistic Orbital Dance",
        subtitle: "Quasi-Circular Gravitational Radiation",
        summary: "Two supermassive singularities orbit their common barycenter at 30% the speed of light, steadily bleeding orbital momentum into spacetime curvature ripples."
      },
      {
        tag: "Phase II: Extreme Chirp Regime",
        title: "Relativistic Plunge & Peak Waveform",
        subtitle: "Gravitational Wave Chirp Peak",
        summary: "Orbit velocity exceeds half light speed. Concentric gravitational wave crests compress and stretch physical space across thousands of light-years."
      },
      {
        tag: "Phase III: Horizon Coalescence",
        title: "Collision & Common Horizon Formation",
        subtitle: "Spacetime Singularity Merger",
        summary: "The two event horizons bridge and fuse into a single chaotic geometry, releasing three solar masses of pure gravitational radiation in milliseconds."
      },
      {
        tag: "Phase IV: Kerr Singularity Ring-Down",
        title: "Equilibrium Kerr Black Hole",
        subtitle: "Harmonic Damping into Calm",
        summary: "Quasi-normal ring-down oscillations settle into a serene, rapidly spinning Kerr black hole, framed by an ultra-bright circular photon sphere."
      }
    ],
    palettes: [
      { core: [0.15, 0.85, 1.0], mid: [0.45, 0.2, 0.95], outer: [0.1, 0.15, 0.4], gasOpacity: 0.35, speed: 0.8, radiusMult: 1.0, holeScale: 0.6 },
      { core: [1.0, 1.0, 1.0], mid: [0.85, 0.15, 0.95], outer: [0.1, 0.9, 1.0], gasOpacity: 0.55, speed: 2.4, radiusMult: 0.7, holeScale: 0.75 },
      { core: [1.0, 0.95, 0.8], mid: [0.95, 0.3, 0.1], outer: [0.8, 0.1, 0.9], gasOpacity: 0.75, speed: 3.5, radiusMult: 0.5, holeScale: 1.1 },
      { core: [0.3, 0.8, 1.0], mid: [0.55, 0.18, 0.88], outer: [0.08, 0.12, 0.25], gasOpacity: 0.25, speed: 0.5, radiusMult: 1.2, holeScale: 0.9 }
    ],
    energyLabel: "Gravitational Wave Luminosity",
    timelineLabel: "Inspiral & Merger Scrubber",
    stages: ["Inspiral Orbit", "Chirp Peak", "Horizon Merger", "Kerr Ringdown"]
  },
  {
    id: 'pulsar-magnetar',
    name: 'Pulsar & Magnetar Lighthouse',
    subtitle: 'Magnetic Dipole & Relativistic Plasma Jets',
    simulationType: 'pulsar_magnetar',
    chapters: [
      {
        tag: "Phase I: Neutron Core Spin-Up",
        title: "Nuclear-Density Dynamo",
        subtitle: "10¹⁵ Gauss Magnetic Field Formation",
        summary: "An ultra-dense stellar corpse spins hundreds of times per second. Hyper-compressed magnetic field lines wind tightly around the stellar poles."
      },
      {
        tag: "Phase II: Synchrotron Acceleration",
        title: "Relativistic Light Cylinder",
        subtitle: "Positron-Electron Pair Cascade",
        summary: "Charged plasma trapped along magnetic flux arches accelerates to 0.99c, emitting brilliant synchrotron radiation across radio to gamma spectra."
      },
      {
        tag: "Phase III: Collimated Polar Jets",
        title: "Lighthouse Beam Emission",
        subtitle: "Bipolar Particle Beaming",
        summary: "Twin high-velocity particle jets blast outward into the interstellar medium, sweeping across the cosmos like a relentless cosmic beacon."
      },
      {
        tag: "Phase IV: Magnetar Flare Outburst",
        title: "Crust Quake & Magnetic Reconnection",
        subtitle: "Giant Synchrotron Blast",
        summary: "Stress on the super-dense crust ruptures magnetic loop lines, discharging a blinding pulse of magnetic energy into the galaxy."
      }
    ],
    palettes: [
      { core: [0.2, 0.95, 0.8], mid: [0.1, 0.6, 0.95], outer: [0.05, 0.15, 0.4], gasOpacity: 0.35, speed: 1.2, radiusMult: 0.9, holeScale: 0.3 },
      { core: [0.5, 1.0, 0.9], mid: [0.2, 0.85, 0.7], outer: [0.6, 0.2, 0.9], gasOpacity: 0.45, speed: 2.0, radiusMult: 1.1, holeScale: 0.4 },
      { core: [1.0, 1.0, 1.0], mid: [0.15, 0.9, 0.85], outer: [0.75, 0.2, 0.95], gasOpacity: 0.55, speed: 3.2, radiusMult: 1.3, holeScale: 0.5 },
      { core: [0.95, 0.9, 1.0], mid: [0.85, 0.2, 0.65], outer: [0.1, 0.75, 0.95], gasOpacity: 0.4, speed: 1.5, radiusMult: 1.4, holeScale: 0.35 }
    ],
    energyLabel: "Synchrotron Magnetic Field Flux",
    timelineLabel: "Rotation & Jet Scrubber",
    stages: ["Dynamo Spin", "Pair Cascade", "Lighthouse Jets", "Magnetar Pulse"]
  },
  {
    id: 'galaxy-collision',
    name: 'Galaxy Collision (Milky Way & Andromeda)',
    subtitle: 'Gravitational Tidal Dance & Coalescence',
    simulationType: 'galaxy_collision',
    chapters: [
      {
        tag: "T - 500 Million Yrs",
        title: "First Approach & Tidal Distortions",
        subtitle: "Mutual Gravitational Infall",
        summary: "Two grand spiral galaxies race toward each other at 110 km/s. Tidal gravitational forces stretch the outer stellar disks into elegant curved bridges."
      },
      {
        tag: "T = 0 (First Pass)",
        title: "Interpenetrating Core Transit",
        subtitle: "Tidal Tail Ejection & Starburst",
        summary: "The galaxies pass directly through one another. Gas clouds collide and ignite a fierce wave of star formation while billions of stars swing outward in tidal plumes."
      },
      {
        tag: "T + 1 Billion Yrs",
        title: "Gravitational Capture Dance",
        subtitle: "Chaotic Orbital Re-encounter",
        summary: "Dynamic friction robs the galaxies of escape velocity. They swing back together, shredding disk structures into intricate crisscrossing stellar streams."
      },
      {
        tag: "T + 3 Billion Yrs",
        title: "Milkomeda: Giant Elliptical",
        subtitle: "Final Coalesced Equilibrium",
        summary: "The two central supermassive black holes merge. The surviving stars settle into a luminous, smooth elliptical super-galaxy under a tranquil sky."
      }
    ],
    palettes: [
      { core: [0.35, 0.85, 1.0], mid: [0.95, 0.45, 0.15], outer: [0.2, 0.5, 0.9], gasOpacity: 0.35, speed: 0.4, radiusMult: 1.1, holeScale: 0.1 },
      { core: [1.0, 0.9, 0.6], mid: [0.9, 0.2, 0.6], outer: [0.15, 0.8, 0.95], gasOpacity: 0.55, speed: 0.85, radiusMult: 1.4, holeScale: 0.2 },
      { core: [1.0, 0.6, 0.2], mid: [0.75, 0.2, 0.85], outer: [0.3, 0.6, 0.95], gasOpacity: 0.45, speed: 0.6, radiusMult: 1.6, holeScale: 0.35 },
      { core: [1.0, 0.95, 0.85], mid: [0.85, 0.55, 0.35], outer: [0.45, 0.3, 0.75], gasOpacity: 0.3, speed: 0.25, radiusMult: 1.5, holeScale: 0.4 }
    ],
    energyLabel: "Tidal Dissipation & Kinetic Energy",
    timelineLabel: "Collision Epoch Scrubber",
    stages: ["First Infall", "Core Transit", "Tidal Slingshot", "Milkomeda"]
  },
  {
    id: 'solar-flare',
    name: 'Solar Flare & Coronal Mass Ejection',
    subtitle: 'Magnetic Reconnection & Plasma Blast',
    simulationType: 'solar_flare',
    chapters: [
      {
        tag: "T - 30 Minutes",
        title: "Magnetic Flux Rope Twisting",
        subtitle: "Photospheric Shear & Helical Strain",
        summary: "Magnetic field lines anchored in sunspot pairs twist under churning convection, storing millions of times the energy of the world's nuclear arsenals."
      },
      {
        tag: "T = 0 (Reconnection)",
        title: "Catastrophic Reconnection Snap",
        subtitle: "X-Class Flash & Relativistic Electrons",
        summary: "Magnetic loop lines violently snap and reconnect into simpler geometries, blasting trillions of electrons downward and flashing in extreme ultraviolet light."
      },
      {
        tag: "T + 2 Hours",
        title: "Coronal Mass Ejection Eruption",
        subtitle: "Billions of Tons of Solar Plasma",
        summary: "A colossal bubble of magnetized hydrogen and helium gas explodes away from the star at 2,000 km/s, forging a shockfront through the solar wind."
      },
      {
        tag: "T + 18 Hours",
        title: "Interplanetary Shockfront",
        subtitle: "Heliospheric Wave Propagation",
        summary: "The CME bubble sweeps across the solar system, buffeting planetary magnetospheres with auroral displays and energetic solar particle storms."
      }
    ],
    palettes: [
      { core: [1.0, 0.95, 0.7], mid: [1.0, 0.5, 0.1], outer: [0.85, 0.15, 0.05], gasOpacity: 0.5, speed: 0.35, radiusMult: 0.9, holeScale: 0.0 },
      { core: [1.0, 1.0, 0.98], mid: [1.0, 0.75, 0.2], outer: [0.95, 0.25, 0.05], gasOpacity: 0.85, speed: 1.8, radiusMult: 1.3, holeScale: 0.1 },
      { core: [1.0, 0.6, 0.15], mid: [0.95, 0.2, 0.3], outer: [0.4, 0.7, 0.95], gasOpacity: 0.6, speed: 1.4, radiusMult: 1.8, holeScale: 0.2 },
      { core: [1.0, 0.45, 0.1], mid: [0.75, 0.25, 0.8], outer: [0.15, 0.6, 0.95], gasOpacity: 0.35, speed: 0.6, radiusMult: 2.2, holeScale: 0.1 }
    ],
    energyLabel: "Magnetic Free Energy Release",
    timelineLabel: "Flare Eruption Scrubber",
    stages: ["Flux Twisting", "X-Class Snap", "Plasma Eruption", "Heliospheric Wave"]
  },
  {
    id: 'cosmic-web',
    name: 'The Cosmic Web & Dark Matter',
    subtitle: 'Mega-Parsec Filaments & Superclusters',
    simulationType: 'cosmic_web',
    chapters: [
      {
        tag: "z = 10 (Early Cosmos)",
        title: "Primordial Density Perturbations",
        subtitle: "Dark Matter Gravitational Scaffolding",
        summary: "Quantum fluctuations from cosmic inflation seed invisible gravitational wells. Invisible dark matter collapses into vast sheets and spider-silk filaments."
      },
      {
        tag: "z = 3 (Filament Accretion)",
        title: "Gas Condensation along Bridges",
        subtitle: "Hydrodynamic River of Baryons",
        summary: "Baryonic gas cascades along the dark matter bridges. At the crossroads, protogalaxies ignite in furious bursts of star formation."
      },
      {
        tag: "z = 0.5 (Supercluster Web)",
        title: "Laniakea-Scale Mega-Structure",
        subtitle: "Luminous Galaxy Superclusters",
        summary: "Tens of thousands of galaxies outline gigantic cosmic voids spanning hundreds of millions of light-years, connected by glowing starlight filaments."
      },
      {
        tag: "z → ∞ (Cosmic Horizon)",
        title: "Dark Energy Disconnection",
        subtitle: "Accelerating Universal Expansion",
        summary: "Dark energy accelerates the separation of filament nodes. The cosmic web begins to stretch and thin as remote galaxy clusters slip beyond the observable horizon."
      }
    ],
    palettes: [
      { core: [0.3, 0.5, 0.95], mid: [0.2, 0.25, 0.6], outer: [0.08, 0.1, 0.3], gasOpacity: 0.35, speed: 0.2, radiusMult: 1.2, holeScale: 0.0 },
      { core: [0.5, 0.85, 1.0], mid: [0.55, 0.2, 0.85], outer: [0.1, 0.35, 0.7], gasOpacity: 0.45, speed: 0.35, radiusMult: 1.3, holeScale: 0.0 },
      { core: [1.0, 0.95, 0.7], mid: [0.4, 0.8, 1.0], outer: [0.65, 0.2, 0.85], gasOpacity: 0.5, speed: 0.45, radiusMult: 1.4, holeScale: 0.0 },
      { core: [0.4, 0.6, 0.9], mid: [0.25, 0.3, 0.55], outer: [0.05, 0.08, 0.2], gasOpacity: 0.2, speed: 0.1, radiusMult: 1.8, holeScale: 0.0 }
    ],
    energyLabel: "Baryon-Dark Matter Gravitational Potential",
    timelineLabel: "Cosmological Redshift Scrubber",
    stages: ["Primordial Web", "Gas Filaments", "Superclusters", "Dark Energy Expansion"]
  }
];

export function getPhenomenonColors(phenomenon, progress) {
  const p = Math.max(0, Math.min(3, progress));
  const idxA = Math.min(Math.floor(p), 2);
  const idxB = idxA + 1;
  const t = p - idxA;

  const palettes = phenomenon.palettes || PRESET_PHENOMENA[0].palettes;
  const cfgA = palettes[idxA] || palettes[0];
  const cfgB = palettes[idxB] || palettes[idxA] || palettes[0];

  const lerp = (a, b, factor) => a + (b - a) * factor;

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

  const gas = [mid[0], mid[1], outer[2]];

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
