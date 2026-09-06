/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    // @vladmandic/human ships a Node.js entry point that imports @tensorflow/tfjs-node.
    // We only use it client-side via dynamic import, so stub the Node dependency.
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push('@vladmandic/human');
    } else {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@tensorflow/tfjs-node': false,
      };
    }
    // Ignore .node binary files (native addons)
    config.resolve.extensions = config.resolve.extensions.filter((ext) => ext !== '.node');
    return config;
  },
};

module.exports = nextConfig;
