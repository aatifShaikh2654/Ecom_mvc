/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: '127.0.0.1',
                port: '8000',
                pathname: '/public/**',
            },
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '8000',
                pathname: '/public/**',
            },
        ],
    },
    env: {
        API_URL : process.env.API_URL,
        IMAGE_URL : process.env.IMAGE_URL,
        COOKIE_SECRET: process.env.COOKIE_SECRET
    },
    trailingSlash: true
};

export default nextConfig;
