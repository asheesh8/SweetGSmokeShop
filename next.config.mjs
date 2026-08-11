/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // three ships untranspiled ESM in a few subpaths; Next handles it, but being
  // explicit keeps the meshopt decoder import from tripping the server compile.
  transpilePackages: ['three'],
  experimental: {
    optimizePackageImports: ['@react-three/drei'],
  },
  async headers() {
    return [
      {
        // Models are content-hashed by filename and never mutate in place.
        source: '/models/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ]
  },
}

export default nextConfig
