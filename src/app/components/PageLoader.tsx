"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

/*
  ╔══════════════════════════════════════════════════════╗
  ║   ARUK BEAUTY LINE — CINEMATIC SPLASH SCREEN         ║
  ║   5-Second multi-phase animation sequence            ║
  ╚══════════════════════════════════════════════════════╝

  Timeline:
  0.0s → Phase 1: Deep black canvas, particles drift in
  0.4s → Phase 2: Logo scales up from micro, rings expand outward
  1.2s → Phase 3: Brand name types in letter by letter
  2.0s → Phase 4: Tagline + golden shimmer line reveal
  3.0s → Phase 5: Full flourish — all rings glow, particles pulse
  4.2s → Phase 6: Fade-to-white wipe exit
  5.0s → Unmount
*/

// LETTERS is static — safe at module scope
const LETTERS = "ARUK BEAUTY LINE".split("");

// Particle type
interface Particle {
  id: number;
  size: number;
  x: number;
  y: number;
  delay: number;
  duration: number;
  opacity: number;
}

function makeParticles(): Particle[] {
  return Array.from({ length: 28 }, (_, i) => ({
    id: i,
    size: 1 + Math.random() * 3,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 3,
    duration: 3 + Math.random() * 4,
    opacity: 0.15 + Math.random() * 0.5,
  }));
}

export default function SplashScreen() {
  const [phase, setPhase] = useState(0);
  const [exiting, setExiting] = useState(false);
  const [gone, setGone] = useState(false);
  const [visibleLetters, setVisibleLetters] = useState(0);
  // Particles are generated client-side only to avoid SSR/hydration mismatch
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mounted, setMounted] = useState(false);

  // Generate particles on the client only (Math.random must not run on server)
  useEffect(() => {
    setParticles(makeParticles());
    setMounted(true);
  }, []);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    timers.push(setTimeout(() => setPhase(1), 100));   // logo enters
    timers.push(setTimeout(() => setPhase(2), 700));   // rings bloom
    timers.push(setTimeout(() => setPhase(3), 1200));  // text starts
    timers.push(setTimeout(() => setPhase(4), 2200));  // tagline
    timers.push(setTimeout(() => setPhase(5), 3100));  // full glow
    timers.push(setTimeout(() => setExiting(true), 4200)); // fade out
    timers.push(setTimeout(() => setGone(true), 5000));    // unmount

    return () => timers.forEach(clearTimeout);
  }, []);

  // Letter-by-letter typewriter for title
  useEffect(() => {
    if (phase < 3) return;
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setVisibleLetters(i);
      if (i >= LETTERS.length) clearInterval(interval);
    }, 55);
    return () => clearInterval(interval);
  }, [phase]);

  if (gone) return null;

  return (
    <div
      className="splash-root"
      style={{ opacity: exiting ? 0 : 1 }}
      aria-hidden="true"
    >
      {/* ── LAYER 0: BASE GRADIENT CANVAS ── */}
      <div className="splash-canvas" />

      {/* ── LAYER 1: FLOATING PARTICLES — client-only to avoid hydration mismatch ── */}
      <div className="splash-particles">
        {mounted && particles.map((p) => (
          <span
            key={p.id}
            className="splash-particle"
            style={{
              width: p.size,
              height: p.size,
              left: `${p.x}%`,
              top: `${p.y}%`,
              opacity: phase >= 1 ? p.opacity : 0,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
            }}
          />
        ))}
      </div>

      {/* ── LAYER 2: RADIAL LIGHT BURST ── */}
      <div
        className="splash-burst"
        style={{ opacity: phase >= 2 ? 1 : 0 }}
      />

      {/* ── LAYER 3: ORBITAL RINGS ── */}
      <div className="splash-rings-wrap">
        {/* Ring 1 — outer slow */}
        <div
          className="splash-ring splash-ring-1"
          style={{ opacity: phase >= 2 ? 1 : 0, transform: phase >= 2 ? "scale(1)" : "scale(0.3)" }}
        />
        {/* Ring 2 — mid reverse */}
        <div
          className="splash-ring splash-ring-2"
          style={{ opacity: phase >= 2 ? 1 : 0, transform: phase >= 2 ? "scale(1)" : "scale(0.3)" }}
        />
        {/* Ring 3 — inner pulse */}
        <div
          className="splash-ring splash-ring-3"
          style={{ opacity: phase >= 2 ? 0.6 : 0, transform: phase >= 2 ? "scale(1)" : "scale(0.3)" }}
        />
        {/* Decorative dot markers on ring 1 */}
        {phase >= 3 && (
          <>
            <div className="splash-ring-dot" style={{ top: "0%", left: "50%", transform: "translate(-50%, -50%)" }} />
            <div className="splash-ring-dot" style={{ bottom: "0%", left: "50%", transform: "translate(-50%, 50%)" }} />
            <div className="splash-ring-dot" style={{ left: "0%", top: "50%", transform: "translate(-50%, -50%)" }} />
            <div className="splash-ring-dot" style={{ right: "0%", top: "50%", transform: "translate(50%, -50%)" }} />
          </>
        )}
      </div>

      {/* ── LAYER 4: LOGO ── */}
      <div
        className="splash-logo-wrap"
        style={{
          opacity: phase >= 1 ? 1 : 0,
          transform: phase >= 1 ? "scale(1)" : "scale(0.05) rotate(-20deg)",
        }}
      >
        <div
          className="splash-logo-glow"
          style={{ opacity: phase >= 5 ? 1 : 0.3 }}
        />
        <div className="splash-logo-img">
          <Image
            src="/aruk_logo_4k.png"
            alt="Aruk Beauty Line"
            fill
            style={{ objectFit: "cover" }}
            priority
          />
        </div>
      </div>

      {/* ── LAYER 5: BRAND TEXT ── */}
      <div className="splash-text-wrap">
        {/* Title — letter by letter */}
        <h1 className="splash-title" aria-label="Aruk Beauty Line">
          {LETTERS.map((letter, i) => (
            <span
              key={i}
              className="splash-letter"
              style={{
                opacity: i < visibleLetters ? 1 : 0,
                transform: i < visibleLetters ? "translateY(0)" : "translateY(12px)",
                display: letter === " " ? "inline" : "inline-block",
                marginRight: letter === " " ? "0.3em" : "0",
              }}
            >
              {letter === " " ? "\u00A0" : letter}
            </span>
          ))}
        </h1>

        {/* Shimmer divider line */}
        <div
          className="splash-divider"
          style={{
            opacity: phase >= 4 ? 1 : 0,
            transform: phase >= 4 ? "scaleX(1)" : "scaleX(0)",
          }}
        />

        {/* Tagline */}
        <p
          className="splash-tagline"
          style={{
            opacity: phase >= 4 ? 1 : 0,
            transform: phase >= 4 ? "translateY(0)" : "translateY(10px)",
          }}
        >
          ✦ &nbsp; Premium Organic Skincare · Uyo, Nigeria &nbsp; ✦
        </p>

        {/* Progress bar */}
        <div className="splash-progress-track" style={{ opacity: phase >= 2 ? 1 : 0 }}>
          <div
            className="splash-progress-fill"
            style={{
              width: exiting ? "100%" : phase >= 5 ? "85%" : phase >= 4 ? "65%" : phase >= 3 ? "45%" : phase >= 2 ? "20%" : "0%",
            }}
          />
        </div>
      </div>

      {/* ── LAYER 6: CORNER ORNAMENTS ── */}
      {phase >= 3 && (
        <>
          <div className="splash-corner splash-corner-tl" />
          <div className="splash-corner splash-corner-tr" />
          <div className="splash-corner splash-corner-bl" />
          <div className="splash-corner splash-corner-br" />
        </>
      )}

      {/* ── EXIT OVERLAY (white wipe) ── */}
      <div
        className="splash-exit-wipe"
        style={{ opacity: exiting ? 1 : 0 }}
      />

      {/* ════════════════════════════════════════════════
          ALL STYLES — scoped within this component
          ════════════════════════════════════════════════ */}
      <style>{`

        /* ROOT */
        .splash-root {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1);
          will-change: opacity;
        }

        /* CANVAS */
        .splash-canvas {
          position: absolute;
          inset: 0;
          background: radial-gradient(
            ellipse 80% 70% at 50% 50%,
            #0d1a04 0%,
            #070e02 40%,
            #040804 70%,
            #020302 100%
          );
        }

        /* PARTICLES */
        .splash-particles {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }
        .splash-particle {
          position: absolute;
          border-radius: 50%;
          background: #7AC620;
          transition: opacity 1.2s ease;
          animation: splashParticleDrift linear infinite;
        }
        @keyframes splashParticleDrift {
          0%   { transform: translate(0, 0) scale(1); }
          25%  { transform: translate(8px, -14px) scale(1.3); }
          50%  { transform: translate(-6px, -28px) scale(0.8); }
          75%  { transform: translate(10px, -16px) scale(1.2); }
          100% { transform: translate(0, 0) scale(1); }
        }

        /* BURST */
        .splash-burst {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 700px;
          height: 700px;
          border-radius: 50%;
          transform: translate(-50%, -50%);
          background: radial-gradient(
            circle,
            rgba(122, 198, 32, 0.12) 0%,
            rgba(122, 198, 32, 0.04) 40%,
            transparent 70%
          );
          transition: opacity 1.2s ease;
          animation: splashBurstPulse 3s ease-in-out infinite;
          pointer-events: none;
        }
        @keyframes splashBurstPulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.7; }
          50%       { transform: translate(-50%, -50%) scale(1.12); opacity: 1; }
        }

        /* RINGS WRAPPER */
        .splash-rings-wrap {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 340px;
          height: 340px;
          transform: translate(-50%, -50%);
          pointer-events: none;
        }
        .splash-ring {
          position: absolute;
          border-radius: 50%;
          transition: opacity 1s ease, transform 1s cubic-bezier(0.34, 1.56, 0.64, 1);
          will-change: transform, opacity;
        }
        .splash-ring-1 {
          inset: 0;
          border: 1.5px solid rgba(122, 198, 32, 0.5);
          animation: splashRing1Spin 12s linear infinite;
          box-shadow: 0 0 20px rgba(122, 198, 32, 0.15), inset 0 0 20px rgba(122, 198, 32, 0.05);
        }
        .splash-ring-2 {
          inset: 22px;
          border: 1px solid rgba(197, 168, 128, 0.4);
          animation: splashRing2Spin 8s linear infinite;
        }
        .splash-ring-3 {
          inset: 46px;
          border: 1px dashed rgba(255, 255, 255, 0.12);
          animation: splashRing1Spin 20s linear infinite;
        }
        .splash-ring-dot {
          position: absolute;
          width: 6px;
          height: 6px;
          background: #7AC620;
          border-radius: 50%;
          box-shadow: 0 0 8px #7AC620;
          animation: splashDotPulse 1.5s ease-in-out infinite;
        }
        @keyframes splashRing1Spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes splashRing2Spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(-360deg); }
        }
        @keyframes splashDotPulse {
          0%, 100% { opacity: 0.6; transform: translate(-50%, -50%) scale(1); }
          50%       { opacity: 1; transform: translate(-50%, -50%) scale(1.5); box-shadow: 0 0 14px #7AC620; }
        }

        /* LOGO */
        .splash-logo-wrap {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 140px;
          height: 140px;
          transition: opacity 0.9s cubic-bezier(0.34, 1.56, 0.64, 1),
                      transform 0.9s cubic-bezier(0.34, 1.56, 0.64, 1);
          will-change: transform, opacity;
        }
        .splash-logo-glow {
          position: absolute;
          inset: -20px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(122, 198, 32, 0.35) 0%, transparent 70%);
          transition: opacity 0.8s ease;
          animation: splashBurstPulse 2s ease-in-out infinite;
          filter: blur(8px);
        }
        .splash-logo-img {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          overflow: hidden;
          border: 2px solid rgba(122, 198, 32, 0.6);
          box-shadow:
            0 0 0 4px rgba(122, 198, 32, 0.1),
            0 0 40px rgba(122, 198, 32, 0.3),
            0 20px 60px rgba(0, 0, 0, 0.8);
          animation: splashLogoFloat 3s ease-in-out infinite;
        }
        @keyframes splashLogoFloat {
          0%, 100% { transform: translateY(0) scale(1); }
          50%       { transform: translateY(-8px) scale(1.02); }
        }

        /* TEXT */
        .splash-text-wrap {
          position: absolute;
          bottom: 15%;
          left: 0;
          right: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          padding: 0 24px;
        }
        .splash-title {
          font-family: Georgia, 'Times New Roman', serif;
          font-size: clamp(18px, 4vw, 26px);
          font-weight: 700;
          letter-spacing: 0.35em;
          color: #ffffff;
          line-height: 1;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
        }
        .splash-letter {
          display: inline-block;
          transition: opacity 0.25s ease, transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
          will-change: opacity, transform;
        }
        .splash-divider {
          width: 180px;
          height: 1px;
          background: linear-gradient(90deg, transparent, #C5A880, #7AC620, #C5A880, transparent);
          transition: opacity 0.6s ease, transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1);
          transform-origin: center;
          box-shadow: 0 0 8px rgba(197, 168, 128, 0.5);
        }
        .splash-tagline {
          font-size: 10px;
          letter-spacing: 0.2em;
          color: #7AC620;
          font-weight: 500;
          text-align: center;
          transition: opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s;
        }
        .splash-progress-track {
          width: min(260px, 60vw);
          height: 2px;
          background: rgba(255, 255, 255, 0.07);
          border-radius: 99px;
          overflow: hidden;
          transition: opacity 0.5s ease;
          margin-top: 6px;
        }
        .splash-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #7AC620, #C5A880, #7AC620);
          border-radius: 99px;
          transition: width 0.9s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 0 8px rgba(122, 198, 32, 0.6);
        }

        /* CORNER ORNAMENTS */
        .splash-corner {
          position: absolute;
          width: 28px;
          height: 28px;
          border-color: rgba(122, 198, 32, 0.4);
          border-style: solid;
          animation: splashCornerFadeIn 0.6s ease both;
        }
        @keyframes splashCornerFadeIn {
          from { opacity: 0; transform: scale(0.5); }
          to   { opacity: 1; transform: scale(1); }
        }
        .splash-corner-tl { top: 20px; left: 20px; border-width: 2px 0 0 2px; }
        .splash-corner-tr { top: 20px; right: 20px; border-width: 2px 2px 0 0; }
        .splash-corner-bl { bottom: 20px; left: 20px; border-width: 0 0 2px 2px; }
        .splash-corner-br { bottom: 20px; right: 20px; border-width: 0 2px 2px 0; }

        /* EXIT WIPE */
        .splash-exit-wipe {
          position: absolute;
          inset: 0;
          background: var(--background, #FAF7F2);
          pointer-events: none;
          transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Mobile adjustments */
        @media (max-width: 480px) {
          .splash-rings-wrap { width: 260px; height: 260px; }
          .splash-logo-wrap  { width: 110px; height: 110px; }
          .splash-corner-tl, .splash-corner-bl { left: 12px; }
          .splash-corner-tr, .splash-corner-br { right: 12px; }
          .splash-corner-tl, .splash-corner-tr { top: 12px; }
          .splash-corner-bl, .splash-corner-br { bottom: 12px; }
        }
      `}</style>
    </div>
  );
}
