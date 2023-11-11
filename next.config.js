/** @type {import('next').NextConfig} */
const withPWA = require("next-pwa");
const runtimeCaching = require("next-pwa/cache.js");
const isProduction = process.env.NODE_ENV === "production";

const config = {
  reactStrictMode: true,
};

const nextConfig = withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: !isProduction,
  runtimeCaching,
})(config);

module.exports = nextConfig;
