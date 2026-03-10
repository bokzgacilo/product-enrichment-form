/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  basePath: "/brand-junkie",
  assetPrefix: "/brand-junkie",

  async redirects() {
    return [
      {
        source: '/',
        destination: '/products',
        permanent: false,
      },
    ]
  },
};

export default nextConfig;