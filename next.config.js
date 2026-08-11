/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // No bundlear módulos de Node.js en el cliente
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        child_process: false,
        http2: false,
      };
    }
    return config;
  },
  // Marcar firebase-admin como externo para que Next.js no lo bundle
  experimental: {
    serverComponentsExternalPackages: ["firebase-admin", "@google-cloud/firestore"],
  },
};

module.exports = nextConfig;
