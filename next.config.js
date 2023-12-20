/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'tailwindui.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'us.api.blizzard.com',
        port: '',
        pathname: '/**',
      }
    ]
  }
}

module.exports = nextConfig
