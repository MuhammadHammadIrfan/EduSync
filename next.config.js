/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Add if you need API routes
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5000/api/:path*', // Proxy to your API server
      },
    ]
  },
  // Enable if you use SVGs
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    })

    return config
  },
}

module.exports = nextConfig