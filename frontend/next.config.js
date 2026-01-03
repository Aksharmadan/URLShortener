/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: false, // 🔴 HARD disable Turbopack
  },
};

module.exports = nextConfig;
