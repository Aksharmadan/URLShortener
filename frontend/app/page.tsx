"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import ParticleBackground from "../components/ParticleBackground";
import GradientMesh from "../components/GradientMesh";
import Spotlight from "../components/Spotlight";

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

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }

      const data = await res.json();

      // ✅ FINAL SHORT LINK
      setShort(`${API_BASE}/${data.shortCode}`);
    } catch (e: any) {
      setError(e.message || "Something broke");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center text-white overflow-hidden">
      <GradientMesh />
      <ParticleBackground />
      <Spotlight />

      <motion.div className="bg-white/10 p-10 rounded-2xl w-[460px]">
        <h1 className="text-4xl font-bold text-center mb-2">URL Shortener</h1>
        <p className="text-gray-400 text-center mb-6">
          Clean links · Analytics · Fast redirects
        </p>

        <input
          className="w-full p-3 mb-3 rounded bg-black/40"
          placeholder="Paste long URL..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />

        <input
          className="w-full p-3 mb-3 rounded bg-black/40"
          placeholder="Custom alias (optional)"
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
        />

        <select
          className="w-full p-3 mb-4 rounded bg-black/40"
          value={expires}
          onChange={(e) => setExpires(e.target.value)}
        >
          <option value="">No expiry</option>
          <option value="1h">Expires in 1 hour</option>
          <option value="1d">Expires in 1 day</option>
          <option value="7d">Expires in 7 days</option>
        </select>

        <button
          onClick={shorten}
          disabled={loading}
          className="w-full bg-purple-600 py-3 rounded"
        >
          {loading ? "Shortening..." : "Shorten URL"}
        </button>

        {error && <p className="text-red-400 mt-4">{error}</p>}

        {short && (
          <div className="mt-6 text-center">
            <p>Your short link</p>
            <a href={short} target="_blank" className="text-blue-400 underline">
              {short}
            </a>
          </div>
        )}
      </motion.div>
    </main>
  );
}
