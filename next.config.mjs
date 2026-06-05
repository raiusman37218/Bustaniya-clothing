/** @type {import('next').NextConfig} */

const nextConfig = {

  reactStrictMode: true,

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'rjkdjbcmyexcbawxgjrd.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },

  eslint: {

    // Pre-existing jsx-key warnings; do not block production deploys

    ignoreDuringBuilds: true,

  },

  experimental: {

    optimizePackageImports: [

      '@mui/material',

      '@mui/icons-material',

      '@mui/lab',

      '@mui/joy',

    ],

  },

  async redirects() {

    return [

      {

        source: '/collection/all/products/:id',

        destination: '/shop/:id',

        permanent: true,

      },

      {

        source: '/collection/:slug/products/:id',

        destination: '/shop/:id',

        permanent: true,

      },

      {

        source: '/collection/:path*',

        destination: '/shop',

        permanent: true,

      },

      { source: '/product/:id', destination: '/shop/:id', permanent: true },

      { source: '/search', destination: '/shop', permanent: true },

      { source: '/plus-size', destination: '/shop', permanent: true },

      { source: '/new-in', destination: '/shop', permanent: true },

      { source: '/modiweek', destination: '/shop', permanent: true },

      { source: '/bustaniya-week', destination: '/shop', permanent: true },

    ];

  },

};



export default nextConfig;

