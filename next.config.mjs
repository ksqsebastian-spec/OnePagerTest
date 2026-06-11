/** @type {import('next').NextConfig} */
const nextConfig = {
  // 'standalone' produces a self-contained server build that drops straight into
  // a Docker image — this is what makes the later Coolify/Hetzner migration a non-event.
  output: "standalone",
};

export default nextConfig;
