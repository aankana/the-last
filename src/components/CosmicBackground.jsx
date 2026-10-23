import React, { useEffect, useRef, useMemo } from 'react';
import { getCosmicColors } from '../utils/cosmicColors';

export default function CosmicBackground({ progress, customColors }) {
  const canvasRef = useRef(null);
  const colors = useMemo(() => customColors || getCosmicColors(progress), [progress, customColors]);
  const colorsRef = useRef(colors);

  useEffect(() => {
    colorsRef.current = colors;
  }, [colors]);

  // Starfield setup and animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Mouse parallax tracking
    let targetMouseX = 0;
    let targetMouseY = 0;
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e) => {
      targetMouseX = (e.clientX / width - 0.5) * 30;
      targetMouseY = (e.clientY / height - 0.5) * 30;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Generate stable cosmic stars
    const starCount = 380;
    const stars = [];
    for (let i = 0; i < starCount; i++) {
      const depth = Math.random(); // 0 (far) to 1 (near)
      stars.push({
        x: Math.random(),
        y: Math.random(),
        depth,
        radius: 0.5 + depth * 1.5,
        baseAlpha: 0.2 + depth * 0.65,
        twinkleSpeed: 0.8 + Math.random() * 2.5,
        twinklePhase: Math.random() * Math.PI * 2,
        isFlared: Math.random() < 0.08, // 8% have subtle 4-point cross diffraction flare
        colorType: Math.random() < 0.35 ? 'era' : (Math.random() < 0.2 ? 'warm' : 'white')
      });
    }

    let clock = 0;
    const render = () => {
      animId = requestAnimationFrame(render);
      clock += 0.016;

      // Smooth mouse parallax
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      ctx.clearRect(0, 0, width, height);

      const currentColors = colorsRef.current;
      const gasRgb = currentColors.gasRgb;

      for (let i = 0; i < starCount; i++) {
        const s = stars[i];
        const parallaxFactor = (s.depth + 0.2);
        const sx = (s.x * width + mouseX * parallaxFactor + width) % width;
        const sy = (s.y * height + mouseY * parallaxFactor + height) % height;

        // Twinkle calculation
        const twinkle = 0.5 + 0.5 * Math.sin(clock * s.twinkleSpeed + s.twinklePhase);
        const alpha = Math.max(0.1, Math.min(1.0, s.baseAlpha * twinkle));

        let fillStyle;
        if (s.colorType === 'era') {
          fillStyle = `rgba(${gasRgb[0]}, ${gasRgb[1]}, ${gasRgb[2]}, ${alpha * 0.9})`;
        } else if (s.colorType === 'warm') {
          fillStyle = `rgba(255, 244, 225, ${alpha})`;
        } else {
          fillStyle = `rgba(240, 248, 255, ${alpha})`;
        }

        ctx.fillStyle = fillStyle;

        // Draw star core
        ctx.beginPath();
        ctx.arc(sx, sy, s.radius, 0, Math.PI * 2);
        ctx.fill();

        // Draw gentle diffraction cross flare on selected prominent stars
        if (s.isFlared && alpha > 0.45) {
          ctx.strokeStyle = fillStyle;
          ctx.lineWidth = 0.6;
          const flareLen = s.radius * 3.8;

          ctx.beginPath();
          ctx.moveTo(sx - flareLen, sy);
          ctx.lineTo(sx + flareLen, sy);
          ctx.moveTo(sx, sy - flareLen);
          ctx.lineTo(sx, sy + flareLen);
          ctx.stroke();

          // Subtle soft halo
          const halo = ctx.createRadialGradient(sx, sy, 0, sx, sy, s.radius * 3.5);
          halo.addColorStop(0, fillStyle);
          halo.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = halo;
          ctx.beginPath();
          ctx.arc(sx, sy, s.radius * 3.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const { gasRgb, midRgb, coreRgb, outerRgb } = colors;

  const nebPrimary = `${gasRgb[0]}, ${gasRgb[1]}, ${gasRgb[2]}`;
  const nebSecondary = `${midRgb[0]}, ${midRgb[1]}, ${midRgb[2]}`;
  const nebAccent = `${coreRgb[0]}, ${coreRgb[1]}, ${coreRgb[2]}`;
  const nebOuter = `${outerRgb[0]}, ${outerRgb[1]}, ${outerRgb[2]}`;

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
        backgroundColor: '#030712',
      }}
    >
      {/* Dynamic Cosmic Nebulae Layer 1 - Top Left Ethereal Cloud */}
      <div
        style={{
          position: 'absolute',
          top: '-15%',
          left: '-5%',
          width: '70vw',
          height: '65vw',
          maxWidth: '1000px',
          maxHeight: '1000px',
          borderRadius: '50%',
          background: `radial-gradient(ellipse at 40% 40%, rgba(${nebPrimary}, 0.28) 0%, rgba(${nebSecondary}, 0.14) 40%, rgba(${nebOuter}, 0.04) 70%, transparent 85%)`,
          filter: 'blur(75px)',
          transform: 'translate3d(0, 0, 0)',
          transition: 'background 0.4s ease-out',
          opacity: 0.95
        }}
      />

      {/* Dynamic Cosmic Nebulae Layer 2 - Center Right Dust Wash */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          right: '-10%',
          width: '65vw',
          height: '60vw',
          maxWidth: '900px',
          maxHeight: '900px',
          borderRadius: '50%',
          background: `radial-gradient(circle at 50% 50%, rgba(${nebSecondary}, 0.22) 0%, rgba(${nebAccent}, 0.12) 45%, rgba(${nebPrimary}, 0.03) 70%, transparent 85%)`,
          filter: 'blur(85px)',
          transform: 'translate3d(0, 0, 0)',
          transition: 'background 0.4s ease-out',
          opacity: 0.9
        }}
      />

      {/* Dynamic Cosmic Nebulae Layer 3 - Bottom Left Core Glow */}
      <div
        style={{
          position: 'absolute',
          bottom: '-25%',
          left: '20%',
          width: '60vw',
          height: '55vw',
          maxWidth: '850px',
          maxHeight: '850px',
          borderRadius: '50%',
          background: `radial-gradient(circle at 50% 50%, rgba(${nebAccent}, 0.18) 0%, rgba(${nebPrimary}, 0.08) 40%, transparent 75%)`,
          filter: 'blur(90px)',
          transform: 'translate3d(0, 0, 0)',
          transition: 'background 0.4s ease-out',
          opacity: 0.85
        }}
      />

      {/* Fullscreen Twinkling Starfield Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          display: 'block'
        }}
      />

      {/* Cosmic Edge Vignette for Cinematic Depth */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 50% 45%, transparent 45%, rgba(2, 6, 23, 0.65) 90%, rgba(2, 4, 15, 0.88) 100%)',
          pointerEvents: 'none'
        }}
      />
    </div>
  );
}