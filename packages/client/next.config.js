/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    // config.module.rules.push({
    //   test: /\.jsx?$/,
    //   loader: "babel-loader",
    //   exclude: /node_modules/,
    //   query: {
    //     presets: ["es2015"],
    //   },
    // });
    return config;
  },
};

module.exports = nextConfig;
