"use client";

import { useEffect } from "react";
import Particles from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { tsParticles } from "@tsparticles/engine";
import type { ISourceOptions } from "@tsparticles/engine";

export default function ParticleBackground() {
  useEffect(() => {
    loadSlim(tsParticles);
  }, []);

  const options: ISourceOptions = {
    background: {
      color: { value: "#000000" },
    },
    fpsLimit: 60,
    particles: {
      number: {
        value: 80,
      },
      color: {
        value: ["#8b5cf6", "#ec4899", "#6366f1"],
      },
      opacity: {
        value: 0.35,
      },
      size: {
        value: { min: 1, max: 3 },
      },
      move: {
        enable: true,
        speed: 0.4,
        direction: "none",
        outModes: {
          default: "out",
        },
      },
    },
    interactivity: {
      events: {
        onHover: {
          enable: true,
          mode: "repulse",
        },
      },
      modes: {
        repulse: {
          distance: 120,
          duration: 0.4,
        },
      },
    },
    detectRetina: true,
  };

  return (
    <Particles
      options={options}
      className="absolute inset-0 -z-10"
    />
  );
}
