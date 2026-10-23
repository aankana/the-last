import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { lerp, ERA_CONFIGS } from '../utils/cosmicColors';

function createGlowTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');

  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
  gradient.addColorStop(0.18, 'rgba(240, 245, 255, 0.85)');
  gradient.addColorStop(0.45, 'rgba(140, 180, 255, 0.35)');
  gradient.addColorStop(0.8, 'rgba(90, 50, 220, 0.08)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(canvas);
}

export default function CosmicCanvas({ progress, fullscreen = false, phenomenon }) {
  const mountRef = useRef(null);
  const stateRef = useRef({ progress, mouseX: 0, mouseY: 0, phenomenon });
  stateRef.current.progress = progress;
  stateRef.current.phenomenon = phenomenon;

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 480;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030712, 0.06);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 3.8, 6.2);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const resizeObserver = new ResizeObserver(() => {
      const nextWidth = container.clientWidth;
      const nextHeight = container.clientHeight;
      if (!nextWidth || !nextHeight) return;

      camera.aspect = nextWidth / nextHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(nextWidth, nextHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });

    resizeObserver.observe(container);

    const glowTexture = createGlowTexture();

    // --- Layer 1: 10,000 High-Density Star / Plasma Points ---
    const starCount = 10000;
    const branches = 3;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    const starCol = new Float32Array(starCount * 3);

    const radii = new Float32Array(starCount);
    const branchAngles = new Float32Array(starCount);
    const yOffsets = new Float32Array(starCount);
    const radialRatios = new Float32Array(starCount);

    // Vector field buffers for all phenomena
    const blastDirections = new Float32Array(starCount * 3);
    const filamentAnchors = new Float32Array(starCount * 3);

    // Cosmic web node points
    const webNodes = [
      [-3.2, 1.4, -1.8],
      [2.8, 1.8, -1.2],
      [-1.8, -1.5, 2.2],
      [3.1, -1.2, 1.6],
      [0.2, 2.4, 0.8],
      [-2.4, -0.2, -2.4],
      [1.5, -2.1, -1.5],
      [0.0, 0.2, 0.0]
    ];

    for (let i = 0; i < starCount; i++) {
      const r = Math.pow(Math.random(), 2.1) * 4.6 + 0.12;
      radii[i] = r;
      radialRatios[i] = Math.min(1.0, r / 4.6);

      const branchAngle = ((i % branches) / branches) * Math.PI * 2;
      branchAngles[i] = branchAngle;

      const spread = (1 - radialRatios[i]) * 0.45 + 0.08;
      yOffsets[i] = (Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1)) * spread;

      starPos[i * 3 + 1] = yOffsets[i];

      // Spherical uniform distribution for explosions & CMEs
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      blastDirections[i * 3] = Math.sin(phi) * Math.cos(theta);
      blastDirections[i * 3 + 1] = Math.sin(phi) * Math.sin(theta);
      blastDirections[i * 3 + 2] = Math.cos(phi);

      // Cosmic web filament positioning
      const nodeA = webNodes[i % webNodes.length];
      const nodeB = webNodes[(i * 3 + 1) % webNodes.length];
      const lerpT = Math.random();
      const jitter = (Math.random() - 0.5) * 0.45;
      filamentAnchors[i * 3] = lerp(nodeA[0], nodeB[0], lerpT) + jitter;
      filamentAnchors[i * 3 + 1] = lerp(nodeA[1], nodeB[1], lerpT) + jitter;
      filamentAnchors[i * 3 + 2] = lerp(nodeA[2], nodeB[2], lerpT) + jitter;
    }

    const scatteredStarPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      scatteredStarPositions[i * 3] = (Math.random() - 0.5) * 14;
      scatteredStarPositions[i * 3 + 1] = (Math.random() - 0.5) * 7;
      scatteredStarPositions[i * 3 + 2] = (Math.random() - 0.5) * 12;
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starCol, 3));

    const starMat = new THREE.PointsMaterial({
      size: 0.065,
      map: glowTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: true
    });

    const starSystem = new THREE.Points(starGeo, starMat);
    scene.add(starSystem);

    // --- Layer 2: 1,500 Volumetric Cosmic Gas Clouds ---
    const gasCount = 1500;
    const gasGeo = new THREE.BufferGeometry();
    const gasPos = new Float32Array(gasCount * 3);
    const gasCol = new Float32Array(gasCount * 3);
    const gasRadii = new Float32Array(gasCount);
    const gasAngles = new Float32Array(gasCount);

    for (let i = 0; i < gasCount; i++) {
      const r = Math.pow(Math.random(), 1.6) * 4.4 + 0.2;
      gasRadii[i] = r;
      const branchAngle = ((i % branches) / branches) * Math.PI * 2;
      gasAngles[i] = branchAngle;
      gasPos[i * 3 + 1] = (Math.random() - 0.5) * 0.6;
    }

    gasGeo.setAttribute('position', new THREE.BufferAttribute(gasPos, 3));
    gasGeo.setAttribute('color', new THREE.BufferAttribute(gasCol, 3));

    const gasMat = new THREE.PointsMaterial({
      size: 0.48,
      map: glowTexture,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: true
    });

    const gasSystem = new THREE.Points(gasGeo, gasMat);
    scene.add(gasSystem);

    // --- Primary Singularity & Photon Ring ---
    const holeGeo = new THREE.SphereGeometry(0.68, 48, 48);
    const holeMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const blackHole = new THREE.Mesh(holeGeo, holeMat);
    scene.add(blackHole);

    const haloGeo = new THREE.RingGeometry(0.68, 0.74, 64);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    });
    const photonRing = new THREE.Mesh(haloGeo, haloMat);
    photonRing.rotation.x = Math.PI / 2;
    scene.add(photonRing);

    // --- Secondary Singularity (for Binary Mergers) ---
    const holeGeo2 = new THREE.SphereGeometry(0.55, 32, 32);
    const holeMat2 = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const blackHole2 = new THREE.Mesh(holeGeo2, holeMat2);
    blackHole2.visible = false;
    scene.add(blackHole2);

    const haloGeo2 = new THREE.RingGeometry(0.55, 0.61, 48);
    const haloMat2 = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    });
    const photonRing2 = new THREE.Mesh(haloGeo2, haloMat2);
    photonRing2.rotation.x = Math.PI / 2;
    photonRing2.visible = false;
    scene.add(photonRing2);

    // --- Relativistic Energy Burst Mesh ---
    const burstGeo = new THREE.SphereGeometry(0.72, 32, 32);
    const burstMat = new THREE.MeshBasicMaterial({
      color: 0xb9e8ff,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const burstGlow = new THREE.Mesh(burstGeo, burstMat);
    scene.add(burstGlow);

    // Mouse tilt interaction
    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      stateRef.current.mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      stateRef.current.mouseY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    };
    window.addEventListener('mousemove', handleMouseMove);

    let animationId;
    const clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();
      const p = Math.max(0, Math.min(3, stateRef.current.progress));
      const currentPhenomenon = stateRef.current.phenomenon;
      const simType = currentPhenomenon?.simulationType || 'galaxy';

      const idxA = Math.min(Math.floor(p), 2);
      const idxB = idxA + 1;
      const t = p - idxA;

      const activePalettes = currentPhenomenon?.palettes || ERA_CONFIGS;
      const cfgA = activePalettes[idxA] || ERA_CONFIGS[idxA];
      const cfgB = activePalettes[idxB] || ERA_CONFIGS[idxB];

      const speed = lerp(cfgA.speed ?? 0.3, cfgB.speed ?? 0.1, t);
      const radiusMult = lerp(cfgA.radiusMult ?? 1.0, cfgB.radiusMult ?? 1.0, t);
      const gasOpacity = lerp(cfgA.gasOpacity ?? 0.3, cfgB.gasOpacity ?? 0.2, t);
      const gasSize = lerp(cfgA.gasSize ?? 0.5, cfgB.gasSize ?? 0.45, t);

      // Color lerp interpolations
      const coreR = lerp(cfgA.core[0], cfgB.core[0], t);
      const coreG = lerp(cfgA.core[1], cfgB.core[1], t);
      const coreB = lerp(cfgA.core[2], cfgB.core[2], t);

      const midR = lerp(cfgA.mid[0], cfgB.mid[0], t);
      const midG = lerp(cfgA.mid[1], cfgB.mid[1], t);
      const midB = lerp(cfgA.mid[2], cfgB.mid[2], t);

      const outR = lerp(cfgA.outer[0], cfgB.outer[0], t);
      const outG = lerp(cfgA.outer[1], cfgB.outer[1], t);
      const outB = lerp(cfgA.outer[2], cfgB.outer[2], t);

      const sPos = starGeo.attributes.position.array;
      const sCol = starGeo.attributes.color.array;
      const gPos = gasGeo.attributes.position.array;
      const gCol = gasGeo.attributes.color.array;

      // ==========================================
      // SIMULATION MODE 1: SUPERNOVA CORE COLLAPSE
      // ==========================================
      if (simType === 'supernova') {
        blackHole.visible = false;
        photonRing.visible = false;
        blackHole2.visible = false;
        photonRing2.visible = false;

        const collapse = THREE.MathUtils.smoothstep(p, 0.72, 1.0);
        const flashIn = THREE.MathUtils.smoothstep(p, 0.95, 1.01);
        const flashOut = THREE.MathUtils.smoothstep(p, 1.02, 1.25);
        const flash = flashIn * (1 - flashOut);
        const blastExpand = THREE.MathUtils.smoothstep(p, 1.0, 3.0);

        burstGlow.scale.setScalar(0.4 + flash * 14 + collapse * 0.4);
        burstMat.opacity = flash * 0.95;
        gasMat.opacity = gasOpacity * (1 + flash * 2.5);
        gasMat.size = gasSize * (1 + blastExpand * 0.8);

        for (let i = 0; i < starCount; i++) {
          const dirX = blastDirections[i * 3];
          const dirY = blastDirections[i * 3 + 1];
          const dirZ = blastDirections[i * 3 + 2];
          const initR = (radii[i] * 0.35 + 0.15) * (1 - collapse * 0.85);
          const blastDist = Math.pow(blastExpand, 1.35) * (4.2 + (i % 7) * 0.4);

          // Central Pulsar Relativistic Jet Beams (Stage IV)
          if (i < 900 && p > 2.0) {
            const jetProgress = ((elapsed * 2.8 + i * 0.02) % 1);
            const jetSign = (i % 2 === 0 ? 1 : -1);
            sPos[i * 3] = Math.sin(elapsed * 16 + i) * 0.09;
            sPos[i * 3 + 1] = jetSign * (0.05 + jetProgress * 4.6);
            sPos[i * 3 + 2] = Math.cos(elapsed * 16 + i) * 0.09;

            sCol[i * 3] = 1.0;
            sCol[i * 3 + 1] = 0.9;
            sCol[i * 3 + 2] = 1.0;
          } else {
            const curR = initR + blastDist;
            sPos[i * 3] = dirX * curR;
            sPos[i * 3 + 1] = dirY * curR;
            sPos[i * 3 + 2] = dirZ * curR;

            const ratio = radialRatios[i];
            const brightness = 1 + flash * 2.8;
            sCol[i * 3] = lerp(coreR, midR, ratio) * brightness;
            sCol[i * 3 + 1] = lerp(coreG, midG, ratio) * brightness;
            sCol[i * 3 + 2] = lerp(coreB, outB, ratio) * brightness;
          }
        }

        for (let i = 0; i < gasCount; i++) {
          const dirX = blastDirections[i * 3];
          const dirY = blastDirections[i * 3 + 1];
          const dirZ = blastDirections[i * 3 + 2];
          const curR = (gasRadii[i] * 0.28) * (1 - collapse * 0.8) + Math.pow(blastExpand, 1.25) * (3.8 + (i % 5) * 0.5);
          gPos[i * 3] = dirX * curR;
          gPos[i * 3 + 1] = dirY * curR;
          gPos[i * 3 + 2] = dirZ * curR;

          gCol[i * 3] = midR;
          gCol[i * 3 + 1] = midG;
          gCol[i * 3 + 2] = outB;
        }

      // ==========================================
      // SIMULATION MODE 2: BINARY BLACK HOLE MERGER
      // ==========================================
      } else if (simType === 'binary_black_hole') {
        const mergeProgress = THREE.MathUtils.smoothstep(p, 0.0, 1.8);
        const isMerged = p >= 1.8;
        const chirpFlash = THREE.MathUtils.smoothstep(p, 1.75, 1.82) * (1 - THREE.MathUtils.smoothstep(p, 1.83, 2.1));
        const separation = Math.max(0, (1.8 - mergeProgress) * 1.6);
        const orbitSpeed = (1.5 + Math.pow(mergeProgress, 2) * 8.5) * speed;
        const angle = elapsed * orbitSpeed;

        blackHole.visible = true;
        photonRing.visible = true;

        if (!isMerged) {
          blackHole.position.set(Math.cos(angle) * separation, 0, Math.sin(angle) * separation);
          blackHole.scale.setScalar(0.55);
          photonRing.position.copy(blackHole.position);
          photonRing.scale.setScalar(0.55);

          blackHole2.visible = true;
          photonRing2.visible = true;
          blackHole2.position.set(-Math.cos(angle) * separation, 0, -Math.sin(angle) * separation);
          blackHole2.scale.setScalar(0.48);
          photonRing2.position.copy(blackHole2.position);
          photonRing2.scale.setScalar(0.48);
        } else {
          blackHole.position.set(0, 0, 0);
          blackHole.scale.setScalar(0.95);
          photonRing.position.set(0, 0, 0);
          photonRing.scale.setScalar(0.95);
          blackHole2.visible = false;
          photonRing2.visible = false;
        }

        burstGlow.scale.setScalar(0.5 + chirpFlash * 10);
        burstMat.opacity = chirpFlash * 0.9;
        gasMat.opacity = gasOpacity;

        // Concentric Spacetime Gravitational Wave Ripples
        for (let i = 0; i < starCount; i++) {
          const r = ((radii[i] * 1.2 + elapsed * 1.5) % 6.0) + 0.3;
          const theta = branchAngles[i] + r * 1.2;
          // Spacetime curvature ripple height
          const waveHeight = Math.sin(r * 5.0 - elapsed * 8.0) * (0.28 / (r * 0.8 + 0.5));

          sPos[i * 3] = Math.cos(theta) * r;
          sPos[i * 3 + 1] = waveHeight;
          sPos[i * 3 + 2] = Math.sin(theta) * r;

          const ratio = radialRatios[i];
          sCol[i * 3] = lerp(coreR, midR, ratio) + chirpFlash;
          sCol[i * 3 + 1] = lerp(coreG, midG, ratio) + chirpFlash;
          sCol[i * 3 + 2] = lerp(coreB, outB, ratio) + chirpFlash;
        }

        for (let i = 0; i < gasCount; i++) {
          const r = gasRadii[i] * 0.9 + 0.2;
          const spin = r * 1.5;
          const currentAngle = gasAngles[i] + spin + elapsed * orbitSpeed * 0.3;
          gPos[i * 3] = Math.cos(currentAngle) * r;
          gPos[i * 3 + 1] = Math.sin(r * 4.0 - elapsed * 7.0) * 0.15;
          gPos[i * 3 + 2] = Math.sin(currentAngle) * r;

          gCol[i * 3] = midR;
          gCol[i * 3 + 1] = midG;
          gCol[i * 3 + 2] = outB;
        }

      // ==========================================
      // SIMULATION MODE 3: PULSAR / MAGNETAR
      // ==========================================
      } else if (simType === 'pulsar_magnetar') {
        blackHole.visible = true;
        blackHole.scale.setScalar(0.42);
        blackHole.position.set(0, 0, 0);
        photonRing.visible = false;
        blackHole2.visible = false;
        photonRing2.visible = false;

        const pulseOutburst = THREE.MathUtils.smoothstep(p, 2.5, 2.65) * (1 - THREE.MathUtils.smoothstep(p, 2.7, 2.95));
        burstGlow.scale.setScalar(0.6 + pulseOutburst * 9);
        burstMat.opacity = pulseOutburst * 0.95;

        const spinSpeed = (12.0 + p * 8.0) * speed;
        const spinAngle = elapsed * spinSpeed;

        for (let i = 0; i < starCount; i++) {
          // 40% particles in Collimated Relativistic Bipolar Jets
          if (i < starCount * 0.4) {
            const jetLength = 5.2;
            const jetProg = ((i / (starCount * 0.4) + elapsed * 3.5) % 1);
            const sign = (i % 2 === 0 ? 1 : -1);
            // Lighthouse precession angle
            const precAngle = spinAngle * 0.3;
            const tilt = 0.22;
            const yBase = sign * (0.35 + jetProg * jetLength);
            const rBeam = (jetProg * 0.35 + 0.04);
            const beamTheta = elapsed * 18 + i;

            sPos[i * 3] = Math.cos(beamTheta) * rBeam + Math.sin(precAngle) * (yBase * tilt);
            sPos[i * 3 + 1] = yBase;
            sPos[i * 3 + 2] = Math.sin(beamTheta) * rBeam + Math.cos(precAngle) * (yBase * tilt);

            sCol[i * 3] = 0.95;
            sCol[i * 3 + 1] = 0.98;
            sCol[i * 3 + 2] = 1.0;
          } else {
            // 60% particles in Closed Dipole Magnetic Field Arches
            const loopIndex = (i % 24) / 24;
            const archAngle = loopIndex * Math.PI * 2 + spinAngle;
            const archR = (radii[i] * 0.65 + 0.5);
            const archPhase = ((i % 100) / 100) * Math.PI;

            const archX = Math.cos(archAngle) * Math.sin(archPhase) * archR;
            const archY = Math.cos(archPhase) * archR * 0.85;
            const archZ = Math.sin(archAngle) * Math.sin(archPhase) * archR;

            sPos[i * 3] = archX;
            sPos[i * 3 + 1] = archY;
            sPos[i * 3 + 2] = archZ;

            const ratio = radialRatios[i];
            sCol[i * 3] = lerp(coreR, midR, ratio);
            sCol[i * 3 + 1] = lerp(coreG, midG, ratio);
            sCol[i * 3 + 2] = lerp(coreB, outB, ratio);
          }
        }

        for (let i = 0; i < gasCount; i++) {
          const r = gasRadii[i] * 0.6 + 0.8;
          const currentAngle = gasAngles[i] + spinAngle * 0.5;
          gPos[i * 3] = Math.cos(currentAngle) * r;
          gPos[i * 3 + 1] = (Math.sin(elapsed * 5 + i) * 0.1);
          gPos[i * 3 + 2] = Math.sin(currentAngle) * r;

          gCol[i * 3] = midR;
          gCol[i * 3 + 1] = midG;
          gCol[i * 3 + 2] = outB;
        }

      // ==========================================
      // SIMULATION MODE 4: GALAXY COLLISION
      // ==========================================
      } else if (simType === 'galaxy_collision') {
        blackHole.visible = true;
        photonRing.visible = true;
        blackHole2.visible = true;
        photonRing2.visible = true;

        const mergeT = THREE.MathUtils.smoothstep(p, 0.0, 3.0);
        const sepX = (1 - mergeT) * 3.4;
        const sepY = Math.sin(mergeT * Math.PI) * 0.6;
        const orbitPhase = elapsed * (0.8 + mergeT * 1.5) * speed;

        blackHole.position.set(Math.cos(orbitPhase) * sepX, sepY, Math.sin(orbitPhase) * sepX * 0.5);
        blackHole.scale.setScalar(0.45);
        photonRing.position.copy(blackHole.position);

        blackHole2.position.set(-Math.cos(orbitPhase) * sepX, -sepY, -Math.sin(orbitPhase) * sepX * 0.5);
        blackHole2.scale.setScalar(0.4);
        photonRing2.position.copy(blackHole2.position);

        if (p > 2.5) {
          blackHole.position.lerp(new THREE.Vector3(0,0,0), 0.05);
          blackHole2.visible = false;
          photonRing2.visible = false;
        }

        burstGlow.scale.setScalar(0.2);
        burstMat.opacity = 0;

        for (let i = 0; i < starCount; i++) {
          const isGalaxyA = i < starCount / 2;
          const center = isGalaxyA ? blackHole.position : blackHole2.position;
          const diskTilt = isGalaxyA ? 0.35 : -0.45;
          const r = radii[i] * 0.65;
          const spin = r * 1.2 + elapsed * (isGalaxyA ? 1.0 : -1.0) * speed;

          // Tidal tail disruption flinging stars outward
          const tidalTail = Math.pow(mergeT, 1.5) * (Math.sin(i * 0.1) * 2.2);

          const localX = Math.cos(branchAngles[i] + spin) * (r + tidalTail);
          const localY = yOffsets[i] + Math.sin(branchAngles[i] + spin) * diskTilt * r;
          const localZ = Math.sin(branchAngles[i] + spin) * (r + tidalTail);

          sPos[i * 3] = center.x + localX;
          sPos[i * 3 + 1] = center.y + localY;
          sPos[i * 3 + 2] = center.z + localZ;

          if (isGalaxyA) {
            sCol[i * 3] = coreR;
            sCol[i * 3 + 1] = midR;
            sCol[i * 3 + 2] = 1.0;
          } else {
            sCol[i * 3] = 1.0;
            sCol[i * 3 + 1] = midG;
            sCol[i * 3 + 2] = outB;
          }
        }

        for (let i = 0; i < gasCount; i++) {
          const isGasA = i < gasCount / 2;
          const center = isGasA ? blackHole.position : blackHole2.position;
          const r = gasRadii[i] * 0.6;
          const spin = r * 1.2 + elapsed * 0.8 * speed;
          gPos[i * 3] = center.x + Math.cos(gasAngles[i] + spin) * r;
          gPos[i * 3 + 1] = center.y + (Math.random() - 0.5) * 0.4;
          gPos[i * 3 + 2] = center.z + Math.sin(gasAngles[i] + spin) * r;

          gCol[i * 3] = midR;
          gCol[i * 3 + 1] = midG;
          gCol[i * 3 + 2] = outB;
        }

      // ==========================================
      // SIMULATION MODE 5: SOLAR FLARE & CME
      // ==========================================
      } else if (simType === 'solar_flare') {
        blackHole.visible = false;
        photonRing.visible = false;
        blackHole2.visible = false;
        photonRing2.visible = false;

        const snapFlash = THREE.MathUtils.smoothstep(p, 0.96, 1.02) * (1 - THREE.MathUtils.smoothstep(p, 1.04, 1.2));
        const cmeEruption = THREE.MathUtils.smoothstep(p, 1.0, 3.0);
        burstGlow.scale.setScalar(0.3 + snapFlash * 11);
        burstMat.opacity = snapFlash * 0.95;

        for (let i = 0; i < starCount; i++) {
          // Base Photosphere Surface Curvature
          const sunR = 3.8;
          const sunX = (i % 100) / 100 * 4.0 - 2.0;
          const sunZ = ((i / 100) % 100) / 100 * 4.0 - 2.0;
          const sunY = -sunR + Math.sqrt(Math.max(0, sunR * sunR - sunX * sunX - sunZ * sunZ));

          if (i < starCount * 0.65) {
            // Erupting CME Bubble & Plasma Stream
            const blastProgress = Math.pow(cmeEruption, 1.4);
            const cmeDirX = blastDirections[i * 3] * 0.7;
            const cmeDirY = Math.abs(blastDirections[i * 3 + 1]) * 1.2 + 0.3; // Directed upward
            const cmeDirZ = blastDirections[i * 3 + 2] * 0.7;
            const dist = blastProgress * (5.5 + (i % 9) * 0.3);

            sPos[i * 3] = sunX * 0.3 + cmeDirX * dist;
            sPos[i * 3 + 1] = sunY * 0.2 + cmeDirY * dist;
            sPos[i * 3 + 2] = sunZ * 0.3 + cmeDirZ * dist;

            sCol[i * 3] = 1.0;
            sCol[i * 3 + 1] = lerp(coreG, midG, snapFlash);
            sCol[i * 3 + 2] = lerp(coreB, outB, snapFlash);
          } else {
            // Solar Surface Convective Granulation
            const jitter = Math.sin(elapsed * 4 + i) * 0.05;
            sPos[i * 3] = sunX;
            sPos[i * 3 + 1] = sunY + jitter;
            sPos[i * 3 + 2] = sunZ;

            sCol[i * 3] = 1.0;
            sCol[i * 3 + 1] = 0.65;
            sCol[i * 3 + 2] = 0.15;
          }
        }

        for (let i = 0; i < gasCount; i++) {
          const blastProgress = Math.pow(cmeEruption, 1.3);
          const cmeDirY = Math.abs(blastDirections[i * 3 + 1]) + 0.4;
          gPos[i * 3] = blastDirections[i * 3] * blastProgress * 4.5;
          gPos[i * 3 + 1] = cmeDirY * blastProgress * 5.0;
          gPos[i * 3 + 2] = blastDirections[i * 3 + 2] * blastProgress * 4.5;

          gCol[i * 3] = midR;
          gCol[i * 3 + 1] = midG;
          gCol[i * 3 + 2] = outB;
        }

      // ==========================================
      // SIMULATION MODE 6: THE COSMIC WEB
      // ==========================================
      } else if (simType === 'cosmic_web') {
        blackHole.visible = false;
        photonRing.visible = false;
        blackHole2.visible = false;
        photonRing2.visible = false;
        burstGlow.scale.setScalar(0.01);
        burstMat.opacity = 0;

        const expansion = 1.0 + p * 0.35;

        for (let i = 0; i < starCount; i++) {
          // Flow along cosmic filaments
          const anchorX = filamentAnchors[i * 3] * expansion;
          const anchorY = filamentAnchors[i * 3 + 1] * expansion;
          const anchorZ = filamentAnchors[i * 3 + 2] * expansion;

          const drift = Math.sin(elapsed * 0.8 + i * 0.01) * 0.08;

          sPos[i * 3] = anchorX + drift;
          sPos[i * 3 + 1] = anchorY + drift;
          sPos[i * 3 + 2] = anchorZ + drift;

          // Glowing nodes vs filaments
          const isNode = i % 12 === 0;
          if (isNode) {
            sCol[i * 3] = 1.0;
            sCol[i * 3 + 1] = 0.95;
            sCol[i * 3 + 2] = 0.6;
          } else {
            sCol[i * 3] = coreR;
            sCol[i * 3 + 1] = midR;
            sCol[i * 3 + 2] = outB;
          }
        }

        for (let i = 0; i < gasCount; i++) {
          const node = webNodes[i % webNodes.length];
          gPos[i * 3] = node[0] * expansion + (Math.random() - 0.5) * 0.6;
          gPos[i * 3 + 1] = node[1] * expansion + (Math.random() - 0.5) * 0.6;
          gPos[i * 3 + 2] = node[2] * expansion + (Math.random() - 0.5) * 0.6;

          gCol[i * 3] = midR;
          gCol[i * 3 + 1] = midG;
          gCol[i * 3 + 2] = outB;
        }

      // ==========================================
      // SIMULATION MODE 7 (DEFAULT): THE LAST LIGHT
      // ==========================================
      } else {
        const burstIn = THREE.MathUtils.smoothstep(p, 2.72, 2.79);
        const burstOut = THREE.MathUtils.smoothstep(p, 2.82, 2.94);
        const burst = burstIn * (1 - burstOut);
        const scatter = THREE.MathUtils.smoothstep(p, 2.78, 3);
        const holeScale = lerp(cfgA.holeScale ?? 0.08, cfgB.holeScale ?? 0.001, t) * (1 - THREE.MathUtils.smoothstep(p, 2.78, 2.91));

        blackHole.visible = true;
        blackHole.position.set(0, 0, 0);
        blackHole.scale.setScalar(holeScale);
        photonRing.visible = holeScale > 0.15;
        photonRing.position.set(0, 0, 0);
        photonRing.scale.setScalar(holeScale);
        blackHole2.visible = false;
        photonRing2.visible = false;

        burstGlow.scale.setScalar(0.8 + burst * 7);
        burstMat.opacity = burst * 0.8;
        gasMat.opacity = gasOpacity * (1 - scatter * 0.95);
        gasMat.size = gasSize;

        for (let i = 0; i < starCount; i++) {
          const r = radii[i] * radiusMult;
          const spin = r * 1.35;
          const currentAngle = branchAngles[i] + spin + elapsed * speed * (1 / (r + 0.3));

          const galaxyX = Math.cos(currentAngle) * r;
          const galaxyY = yOffsets[i] * (idxA === 2 ? 0.2 : 1.0);
          const galaxyZ = Math.sin(currentAngle) * r;
          sPos[i * 3] = lerp(galaxyX, scatteredStarPositions[i * 3], scatter);
          sPos[i * 3 + 1] = lerp(galaxyY, scatteredStarPositions[i * 3 + 1], scatter);
          sPos[i * 3 + 2] = lerp(galaxyZ, scatteredStarPositions[i * 3 + 2], scatter);

          const ratio = radialRatios[i];
          if (ratio < 0.25) {
            const factor = ratio / 0.25;
            sCol[i * 3] = lerp(coreR, midR, factor);
            sCol[i * 3 + 1] = lerp(coreG, midG, factor);
            sCol[i * 3 + 2] = lerp(coreB, midB, factor);
          } else {
            const factor = (ratio - 0.25) / 0.75;
            sCol[i * 3] = lerp(midR, outR, factor);
            sCol[i * 3 + 1] = lerp(midG, outG, factor);
            sCol[i * 3 + 2] = lerp(midB, outB, factor);
          }

          const brightness = 1 + burst * 1.8;
          sCol[i * 3] *= brightness;
          sCol[i * 3 + 1] *= brightness;
          sCol[i * 3 + 2] *= brightness;
        }

        for (let i = 0; i < gasCount; i++) {
          const r = gasRadii[i] * radiusMult;
          const spin = r * 1.35;
          const currentAngle = gasAngles[i] + spin + elapsed * (speed * 0.85) * (1 / (r + 0.4));

          gPos[i * 3] = Math.cos(currentAngle) * r;
          gPos[i * 3 + 1] = (Math.random() - 0.5) * 0.6;
          gPos[i * 3 + 2] = Math.sin(currentAngle) * r;

          gCol[i * 3] = midR;
          gCol[i * 3 + 1] = midG;
          gCol[i * 3 + 2] = outB;
        }
      }

      starGeo.attributes.position.needsUpdate = true;
      starGeo.attributes.color.needsUpdate = true;
      gasGeo.attributes.position.needsUpdate = true;
      gasGeo.attributes.color.needsUpdate = true;

      camera.position.x += (stateRef.current.mouseX * 0.8 - camera.position.x) * 0.04;
      camera.position.y += (3.8 + stateRef.current.mouseY * 0.6 - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
      renderer.dispose();
      starGeo.dispose();
      starMat.dispose();
      gasGeo.dispose();
      gasMat.dispose();
      holeGeo.dispose();
      holeMat.dispose();
      haloGeo.dispose();
      haloMat.dispose();
      holeGeo2.dispose();
      holeMat2.dispose();
      haloGeo2.dispose();
      haloMat2.dispose();
      burstGeo.dispose();
      burstMat.dispose();
      glowTexture.dispose();
      if (container) container.innerHTML = '';
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      style={{
        width: '100%',
        height: fullscreen ? '100vh' : '480px',
        borderRadius: fullscreen ? '0' : '12px',
        overflow: 'hidden',
        cursor: 'grab'
      }} 
    />
  );
}
