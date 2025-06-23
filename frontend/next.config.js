/** @type {import('next').NextConfig} */
const nextConfig = {
  // Otimizações de performance
  images: {
    domains: ['localhost'],
    formats: ['image/webp', 'image/avif'],
  },

  // Configurações para melhor performance
  swcMinify: true,

  // Configurações de compilação
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Headers de cache
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=300, s-maxage=300',
          },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },

  // Configurações de webpack para otimização
  webpack: (config, { dev, isServer }) => {
    // Otimizações apenas em produção
    if (!dev) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: -10,
            chunks: 'all',
          },
          common: {
            name: 'common',
            minChunks: 2,
            priority: -5,
            chunks: 'all',
          },
        },
      }
    }

    return config
  },

  // Configurações de output
  output: 'standalone',

  // Redirecionamentos
  async redirects() {
    return [
      // Removido o redirecionamento automático de / para /dashboard
      // Agora o usuário precisa clicar em "Login" para ir ao dashboard
    ]
  },
}

module.exports = nextConfig
