/** @type {import('next').NextConfig} */
const nextConfig = {
  // Server Actions são habilitadas por padrão no Next.js 14
  images: {
    domains: ['localhost'],
  },
  // Configurações para melhor performance
  transpilePackages: ['framer-motion'],
  swcMinify: true,
}

module.exports = nextConfig
