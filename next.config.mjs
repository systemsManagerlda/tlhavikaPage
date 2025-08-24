/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "systemsmanagerlda.s3.eu-north-1.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;
