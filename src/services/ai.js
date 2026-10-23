import { PRESET_PHENOMENA } from './phenomena';

export async function getCosmicChronicle(phenomenonId, chapterTitle, eraIndex, eraDescription) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  const fallbackLibrary = {
    'deep-time': [
      "The sky is dense with embryonic light. Galaxies spin like luminous fireflies in the fresh dark, and every particle carries the reckless, unspent potential of youth.",
      "The great stellar forges have shuttered. In their place, dull red embers and iron-hearted white dwarfs cool silently over trillions of years, clutching their remaining warmth.",
      "Light is now a relic of forgotten antiquity. The titans have gathered—colossal black holes warping the very fabric of silence, slowly exhaling energy into the void.",
      "Nothing begins. Nothing ends. The last black hole has evaporated into a brief sigh of Hawking photons. Entropy has won, and the cosmos rests in absolute, eternal stillness."
    ],
    'supernova': [
      "The supergiant trembles with uncontained fusion. Core temperatures climb to billions of degrees as the inner silicon mantle turns to iron, writing the star's final moments.",
      "In a fraction of a second, the core rebounds. A blinding neutrino tsunami breaches the stellar envelope, outshining an entire galaxy with incandescent fury.",
      "Vast shockwave filaments surge through the void at a fraction of light speed, scattering forged stardust, gold, and platinum to seed future worlds across the galaxy.",
      "Where a brilliant sun once reigned, only an intricate glowing nebula remains—anchored by a lone spinning pulsar pulsing its magnetic heartbeat into the infinite quiet."
    ],
    'binary-black-hole': [
      "Two gargantuan tears in reality circle one another in an inescapable gravitational waltz, churning the surrounding sea of starlight into warped optical illusions.",
      "Spacetime rings like a struck crystal bell. As orbital speeds surge past half the speed of light, tidal gravity rips reality into concentric ripples radiating across the universe.",
      "The singularity boundaries touch and violently coalesce. In a fleeting millisecond, three solar masses of matter dissolve into pure, invisible gravitational radiation.",
      "The violent storm of spacetime curvature settles. A single pristine Kerr black hole spins in majestic silence, encircled by a razor-thin halo of trapped photons."
    ],
    'pulsar-magnetar': [
      "Within a sphere no larger than a city, the crushed core of a giant sun spins hundreds of times each second, wrapping magnetic field lines like coiled cosmic springs.",
      "Trapped relativistic electrons race along magnetic arches at 99% light speed, blasting synchrotron radiation through the void in brilliant arcs of electric sapphire.",
      "Like a cosmic lighthouse cutting through the abyss, the bipolar particle jets sweep across the cosmos, a rhythmic ticking clock defying the emptiness of space.",
      "Magnetic reconnection ruptures the superdense crust. A giant magnetar pulse detonates into the interstellar medium, a reminder of the raw ferocity locked in dead stars."
    ],
    'galaxy-collision': [
      "Two titanic islands of starlight plunge toward an inevitable rendezvous. Long before stars collide, their mutual gravitational embrace draws out grand stellar bridges.",
      "Interpenetrating stellar discs sweep through each other like ghosts in the dark. Compressed interstellar gas clouds erupt into a fiery starburst of newborn blue suns.",
      "Vast tidal ribbons of hundreds of billions of stars swing outward into the intergalactic void, tracing arcs of light across hundreds of thousands of light-years.",
      "The chaotic turbulence dissolves into peace. The two galaxies fuse into Milkomeda—a magnificent golden elliptical super-galaxy shining serenely in the deep night."
    ],
    'solar-flare': [
      "Deep beneath the incandescent photosphere, churning convective plasma twists magnetic flux ropes into strained loops, storing titanic thermonuclear pressure.",
      "Magnetic reconnection snaps in an instant. A blinding flash of X-rays and relativistic electron beams erupts, outshining the star across high-energy wavelengths.",
      "Billions of tons of magnetized plasma detach from the stellar crown, surging outwards as an expanding magnetized coronal bubble traveling at millions of miles per hour.",
      "The interplanetary shockwave sweeps across the heliosphere, igniting auroral storms on magnetic worlds and carving an energetic wake through the solar wind."
    ],
    'cosmic-web': [
      "In the primordial cradle of the early universe, invisible scaffolding of dark matter collapses into an intricate, gossamer spiderweb spanning hundreds of megaparsecs.",
      "Rivers of primordial hydrogen and helium cascade along the dark matter bridges, pooling at cosmic crossroads where the first galaxies ignite.",
      "Luminous superclusters form brilliant nodes connected by glowing stellar filaments, tracing the grandest architectural tapestry in the observable cosmos.",
      "Dark energy accelerates the cosmic void. The great filaments slowly stretch and attenuate, leaving remote galaxy clusters like solitary islands in an ever-expanding sea."
    ]
  };

  const currentFallbacks = fallbackLibrary[phenomenonId] || fallbackLibrary['deep-time'];

  if (!apiKey) {
    return currentFallbacks[eraIndex] || currentFallbacks[0];
  }

  const prompt = `You are the Gemma 4 Cosmic Archivist observing ${phenomenonId} during ${chapterTitle}.
Context: ${eraDescription}.
Write a 2 to 3 sentence poetic, cinematic, and awe-inspiring observation about matter, radiation, time, and gravity.
Speak with emotional resonance, quiet scientific wonder, and vivid imagery. Avoid dry math equations.`;

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemma-4-26b-a4b-it:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });
    
    if (!response.ok) throw new Error("API call failed");
    
    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (_err) {
    return currentFallbacks[eraIndex] || currentFallbacks[0];
  }
}

export async function askGemmaArchivist(question, phenomenonTitle, chapterTitle, eraDescription) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    const qLower = question.toLowerCase();
    if (qLower.includes('life') || qLower.includes('survive')) {
      return "Biological life as we understand it would be shredded by the raw radiation gradients here; yet hypothetical computronium substrates or relativistic crystal civilizations might endure on the extreme orbital fringes.";
    }
    if (qLower.includes('element') || qLower.includes('gold') || qLower.includes('matter')) {
      return "In this phase, rapid neutron capture (r-process nucleosynthesis) forges the heaviest elements in existence—gold, platinum, and actinide salts—scattering them like seed across the intergalactic void.";
    }
    return `Observing across the deep epochs of ${phenomenonTitle}, the physical laws bend under extreme spacetime curvature. The energy gradients here remain one of the cosmos's greatest thermodynamic masterpieces.`;
  }

  const prompt = `You are the Gemma 4 Cosmic Archivist observing ${phenomenonTitle} during ${chapterTitle} (${eraDescription}).
A visiting human observer asks you: "${question}".
Answer in 2-3 poetic, scientifically grounded, awe-inspiring sentences with quiet cosmic wisdom.`;

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemma-4-26b-a4b-it:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });
    if (!response.ok) throw new Error("API call failed");
    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (_err) {
    return "The transmission wavers through the gravitational flux, yet starlight confirms that energy and entropy continue their eternal cosmic dialogue.";
  }
}

export async function generateCosmicPhenomenon(userPrompt) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const lower = userPrompt.toLowerCase();

  // Instant smart mapper for presets when offline
  if (!apiKey) {
    if (lower.includes('black hole') || lower.includes('merger') || lower.includes('gravitational wave') || lower.includes('inspiral')) {
      return PRESET_PHENOMENA.find(p => p.id === 'binary-black-hole');
    }
    if (lower.includes('pulsar') || lower.includes('magnetar') || lower.includes('lighthouse') || lower.includes('neutron star')) {
      return PRESET_PHENOMENA.find(p => p.id === 'pulsar-magnetar');
    }
    if (lower.includes('collision') || lower.includes('andromeda') || lower.includes('merging') || lower.includes('milky way')) {
      return PRESET_PHENOMENA.find(p => p.id === 'galaxy-collision');
    }
    if (lower.includes('flare') || lower.includes('solar') || lower.includes('sun') || lower.includes('cme') || lower.includes('coronal')) {
      return PRESET_PHENOMENA.find(p => p.id === 'solar-flare');
    }
    if (lower.includes('web') || lower.includes('dark matter') || lower.includes('filament') || lower.includes('cluster') || lower.includes('laniakea')) {
      return PRESET_PHENOMENA.find(p => p.id === 'cosmic-web');
    }
    if (lower.includes('supernova') || lower.includes('explosion') || lower.includes('detonation') || lower.includes('blast')) {
      return PRESET_PHENOMENA.find(p => p.id === 'supernova');
    }
    return PRESET_PHENOMENA.find(p => p.id === 'deep-time');
  }

  const systemInstruction = `You are an astrophysicist and computational WebGL engine architect.
Generate a valid JSON object defining an interactive 4-stage 3D cosmic animation for the user's prompt: "${userPrompt}".
Strictly output ONLY valid JSON without markdown fences.
JSON Schema:
{
  "id": "string",
  "name": "string (Short Title)",
  "subtitle": "string",
  "simulationType": "galaxy" | "supernova" | "binary_black_hole" | "pulsar_magnetar" | "galaxy_collision" | "solar_flare" | "cosmic_web",
  "energyLabel": "string (e.g. Gravitational Energy Flux, Luminosity, Solar Wind Flux)",
  "timelineLabel": "string",
  "stages": ["Stage 1 Name", "Stage 2 Name", "Stage 3 Name", "Stage 4 Name"],
  "chapters": [
    { "tag": "Time tag", "title": "Stage Title", "subtitle": "Subtitle", "summary": "1-2 sentence description" },
    ... 4 items total
  ],
  "palettes": [
    { "core": [r,g,b (0-1)], "mid": [r,g,b (0-1)], "outer": [r,g,b (0-1)], "gasOpacity": number (0.1-0.6), "speed": number, "radiusMult": number, "holeScale": number }
    ... 4 items total
  ]
}`;

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: systemInstruction }] }]
      })
    });

    if (!response.ok) throw new Error("Gemini API call failed");
    const data = await response.json();
    const rawText = data.candidates[0].content.parts[0].text;
    const cleanJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanJson);
  } catch (_err) {
    if (lower.includes('black hole') || lower.includes('merger')) return PRESET_PHENOMENA.find(p => p.id === 'binary-black-hole');
    if (lower.includes('pulsar') || lower.includes('magnetar')) return PRESET_PHENOMENA.find(p => p.id === 'pulsar-magnetar');
    if (lower.includes('collision') || lower.includes('andromeda')) return PRESET_PHENOMENA.find(p => p.id === 'galaxy-collision');
    if (lower.includes('flare') || lower.includes('solar')) return PRESET_PHENOMENA.find(p => p.id === 'solar-flare');
    if (lower.includes('web') || lower.includes('dark matter')) return PRESET_PHENOMENA.find(p => p.id === 'cosmic-web');
    if (lower.includes('supernova')) return PRESET_PHENOMENA.find(p => p.id === 'supernova');
    return PRESET_PHENOMENA.find(p => p.id === 'deep-time');
  }
}
