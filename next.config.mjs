/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/subframe/image/upload/v1711417507/shared/y2rsnhq3mex4auk54aye.png',
      },
    ],
  },
};

export default nextConfig;
