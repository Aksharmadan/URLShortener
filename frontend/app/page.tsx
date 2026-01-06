"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import ParticleBackground from "../components/ParticleBackground";
import GradientMesh from "../components/GradientMesh";
import Spotlight from "../components/Spotlight";

// 🔥 HARD-CODE BACKEND (NO ENV DRAMA)
const API_BASE = "https://urlshortener-xxtz.onrender.com";

export default function Home() {
  const [url, setUrl] = useState("");
  const [custom, setCustom] = useState("");
  const [expires, setExpires] = useState("");
  const [short, setShort] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const shorten = async () => {
    setLoading(true);
    setError("");
    setShort("");

    const payload = {
      originalUrl: url,
      customCode: custom || undefined,
      expiresIn:
        expires === "1h"
          ? 3600
          : expires === "1d"
          ? 86400
          : expires === "7d"
          ? 604800
          : null,
    };

    try {
     const res = await fetch(`${API_BASE}/shorten`, {

        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // 🔥 SAFETY: if backend sends HTML (404 etc)
      const text = await res.text();
      let data: any;

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Backend error (not JSON). Check API route.");
      }

      if (!res.ok) {
        throw new Error(data.error || "Failed to shorten URL");
      }

      // ✅ FINAL SHORT URL
   const fullShortUrl = `${API_BASE}/${data.shortCode}`;

      setShort(fullShortUrl);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center text-white overflow-hidden">
      <GradientMesh />
      <ParticleBackground />
      <Spotlight />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative bg-white/10 backdrop-blur-xl p-10 rounded-2xl border border-white/20 w-[460px]
                   shadow-[0_0_120px_rgba(168,85,247,0.35)]"
      >
        <h1 className="text-4xl font-bold text-center mb-2">
          URL Shortener
        </h1>
        <p className="text-gray-400 text-center mb-6">
          Clean links · Analytics · Fast redirects
        </p>

        <input
          className="w-full p-3 mb-3 rounded bg-black/40 border border-white/20"
          placeholder="Paste long URL..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />

        <input
          className="w-full p-3 mb-3 rounded bg-black/40 border border-white/20"
          placeholder="Custom alias (optional)"
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
        />

        <select
          className="w-full p-3 mb-4 rounded bg-black/40 border border-white/20"
          value={expires}
          onChange={(e) => setExpires(e.target.value)}
        >
          <option value="">No expiry</option>
          <option value="1h">Expires in 1 hour</option>
          <option value="1d">Expires in 1 day</option>
          <option value="7d">Expires in 7 days</option>
        </select>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          onClick={shorten}
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 py-3 rounded font-semibold"
        >
          {loading ? "Shortening..." : "Shorten URL"}
        </motion.button>

        {error && (
          <p className="text-red-400 text-sm mt-4 text-center">
            {error}
          </p>
        )}

        {short && (
          <div className="mt-6 bg-black/40 p-4 rounded border border-white/10 text-center">
            <p className="text-sm text-gray-400 mb-1">Your short link</p>
            <a
              href={short}
              target="_blank"
              rel="noreferrer"
              className="text-blue-400 underline break-all"
            >
              {short}
            </a>
          </div>
        )}
      </motion.div>
    </main>
  );
}
