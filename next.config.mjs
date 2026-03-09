/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  async redirects() {
    return [
      {
        source: '/',
        destination: '/corewip',
        permanent: false,
      },
    ]
  },
};

export default nextConfig;