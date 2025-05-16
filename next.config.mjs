/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Don't run ESLint during builds - use separate lint command
    ignoreDuringBuilds: true,
  },
  reactStrictMode: true,
  transpilePackages: ['date-fns', 'react-datepicker'],
};

export default nextConfig;
