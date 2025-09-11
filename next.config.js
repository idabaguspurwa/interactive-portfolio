/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },
  
  // Performance optimizations
  experimental: {
    optimizeServerReact: true,
  },
  
  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Optimize bundle splitting and tree shaking
  webpack: (config, { dev, isServer }) => {
    // Enhanced tree shaking - only in production
    if (!dev) {
      config.optimization.usedExports = true;
      // Don't override sideEffects globally as it can break some packages
    }
    
    if (!dev && !isServer) {
      config.optimization.splitChunks.chunks = 'all';
      config.optimization.splitChunks.maxSize = 200000; // 200KB max chunks
      config.optimization.splitChunks.cacheGroups = {
        ...config.optimization.splitChunks.cacheGroups,
        // Split heavy visualization libraries
        d3: {
          test: /[\\/]node_modules[\\/]d3.*[\\/]/,
          name: 'd3-vendor',
          chunks: 'all',
          priority: 30,
        },
        plot: {
          test: /[\\/]node_modules[\\/]@observablehq[\\/]/,
          name: 'plot-vendor', 
          chunks: 'all',
          priority: 25,
        },
        framer: {
          test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
          name: 'framer-vendor',
          chunks: 'all',
          priority: 20,
        },
        three: {
          test: /[\\/]node_modules[\\/](@react-three|three)[\\/]/,
          name: 'three-vendor',
          chunks: 'all',
          priority: 15,
        },
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          priority: 10,
        },
        common: {
          name: 'common',
          minChunks: 2,
          chunks: 'all',
          priority: 5,
          reuseExistingChunk: true,
        },
      };
    }
    return config;
  },
}

module.exports = nextConfig
