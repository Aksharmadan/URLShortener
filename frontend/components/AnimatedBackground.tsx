"use client";
import { motion } from "framer-motion";

export default function AnimatedBackground() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <motion.div
        className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-purple-500/30 rounded-full blur-3xl"
        animate={{ x: [0, 100, 0], y: [0, 80, 0] }}
        transition={{ duration: 20, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-pink-500/30 rounded-full blur-3xl"
        animate={{ x: [0, -120, 0], y: [0, -60, 0] }}
        transition={{ duration: 25, repeat: Infinity }}
      />
    </div>
  );
}
