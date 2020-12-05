/** @type {import("snowpack").SnowpackUserConfig } */
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
      preloadCSS: false,
      //preloadCSSFileName: "/css/app.114514.css",
      target: ["chrome49"]
    }],
    [
      '@snowpack/plugin-webpack',
      {
        htmlMinifierOptions: true,
        manifest: "./manifest.json",
      },
    ],
  ],
  proxy: {
    "/api/jsonrpc": "https://aka.186526.xyz/api/jsonrpc",
    "/api/new": "https://aka.186526.xyz/api/new",
  }
};
