/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/old-route',
        destination: '/new-route',
        permanent: true, // Define se o redirecionamento é permanente ou temporário
      },
      {
        source: '/old-dashboard',
        destination: '/dashboard',
        permanent: false, // Redirecionamento temporário
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://external-api.com/:path*', // Exemplo de reescrita para proxy
      },
    ];
  },
};

export default nextConfig;

