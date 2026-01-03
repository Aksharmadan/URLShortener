"use client";
import { useState } from "react";

export default function Analytics() {
  const [code, setCode] = useState("");
  const [data, setData] = useState<any>(null);

  const fetchAnalytics = async () => {
    const res = await fetch(
      `http://localhost:5050/analytics/${code}`
    );
    const json = await res.json();
    setData(json);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center text-white">
      <div className="bg-white/10 backdrop-blur-xl p-10 rounded-2xl border border-white/20 w-[500px]">
        <h1 className="text-3xl font-bold mb-6 text-center">Analytics</h1>

        <input
          className="w-full p-3 rounded bg-black/40 border border-white/20 mb-4"
          placeholder="Enter short code (e.g. a9XkP2)"
          value={code}
          onChange={e => setCode(e.target.value)}
        />

        <button
          onClick={fetchAnalytics}
          className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 py-3 rounded font-semibold hover:scale-105 transition"
        >
          View Analytics
        </button>

        {data && (
          <div className="mt-6 space-y-4">
            <p>📊 Total Clicks: <b>{data.totalClicks}</b></p>
            <p>📱 Mobile: {data.devices.mobile}</p>
            <p>🖥️ Desktop: {data.devices.desktop}</p>

            <div className="max-h-40 overflow-y-auto text-sm text-gray-300 border-t border-white/10 pt-3">
              {data.clicks.map((c: any, i: number) => (
                <p key={i}>
                  {new Date(c.clicked_at).toLocaleString()}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
