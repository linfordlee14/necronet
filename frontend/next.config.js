/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,

    // Image optimization for S3 storage
    images: {
        remotePatterns: [{
                protocol: 'https',
                hostname: '**.amazonaws.com',
            },
            {
                protocol: 'https',
                hostname: '**.digitaloceanspaces.com',
            },
            {
                protocol: 'https',
                hostname: '**.wasabisys.com',
            },
        ],
    },

    // Headers for security
    async headers() {
        return [{
            source: '/:path*',
            headers: [{
                    key: 'X-Frame-Options',
                    value: 'SAMEORIGIN',
                },
                {
                    key: 'X-Content-Type-Options',
                    value: 'nosniff',
                },
                {
                    key: 'Referrer-Policy',
                    value: 'strict-origin-when-cross-origin',
                },
            ],
        }, ];
    },
};

module.exports = nextConfig;