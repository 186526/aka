/** @type {import("snowpack").SnowpackUserConfig } */
const buildConfig = require("./build.config");
module.exports = {
  mount: {
    public: '/',
    src: '/_dist_',
  },
  plugins: [
    ["@snowpack/plugin-optimize", {
      minifyJS: true,
      minifyCSS: true,
      minifyHTML: true,
      preloadModules: false,
      preloadCSS: true,
      preloadCSSFileName: buildConfig.cssname,
      //target: ["chrome49"]
    }],
    [
      '@snowpack/plugin-webpack',
      {
        htmlMinifierOptions: true,
        manifest: "./manifest.json",
        extendConfig: (config) => {
          const { ESBuildPlugin } = require('esbuild-loader');
          config.module.rules.push({
            test: /\.[jt]sx?$/,
            loader: 'esbuild-loader',
            options: {
              target: 'chrome49',
            },
          });
          config.plugins.push(new ESBuildPlugin());
          return config;
        }
      },
    ],
  ],
  proxy: {
    "/api/jsonrpc": "https://aka.186526.xyz/api/jsonrpc",
    "/api/new": "https://aka.186526.xyz/api/new",
  }
};
