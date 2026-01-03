"use client";
import { motion } from "framer-motion";

export default function GradientMesh() {
  return (
    <motion.div
      className="absolute inset-0 -z-20 bg-gradient-to-br from-purple-900/30 via-black to-pink-900/30"
      animate={{
        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
      }}
      transition={{
        duration: 20,
        repeat: Infinity,
        ease: "linear",
      }}
      style={{
        backgroundSize: "400% 400%",
      }}
    />
  );
}
