const webpack = require('webpack');
const merge = require('webpack-merge');
const SWPrecachePlugin = require('sw-precache-webpack-plugin');
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin');
const base = require('./webpack.base.config');
// const nodeExternals = require('webpack-node-externals')

const config = merge(base, {
  entry: {
    app: './src/entry-client.js',
  },
  resolve: {
    alias: {
      // 'create-api': './create-api-client.js'
    },
  },
  // externals: [nodeExternals()],
  plugins: [
    // strip dev-only code in Vue source
    new webpack.DefinePlugin({
      'process.env.VUE_ENV': '"client"',
    }),
    new VueSSRClientPlugin(),
  ],
  optimization: {
    runtimeChunk: {
      name: 'manifest',
    },
    // extract webpack runtime & manifest to avoid vendor chunk hash changing
    // on every build.
    // extract vendor chunks for better caching
    splitChunks: {
      chunks: 'initial',
      cacheGroups: {
        vendors: {
          test(module, chunks) {
            // ...
            // return module.type === 'javascript/auto';
            return (
              // it's inside node_modules
              /node_modules/.test(module.context)
              // and not a CSS file (due to extract-text-webpack-plugin limitation)
              && !/\.css$/.test(module.request)
            );
          },
        },
      },
    },
  },
});

// if (process.env.NODE_ENV === 'production') {
//   config.plugins.push(
//     // auto generate service worker
//     new SWPrecachePlugin({
//       cacheId: 'vue-hn',
//       filename: 'service-worker.js',
//       minify: true,
//       dontCacheBustUrlsMatching: /./,
//       staticFileGlobsIgnorePatterns: [/\.map$/, /\.json$/],
//       runtimeCaching: [
//         {
//           urlPattern: '/',
//           handler: 'networkFirst'
//         },
//         {
//           urlPattern: /\/(top|new|show|ask|jobs)/,
//           handler: 'networkFirst'
//         },
//         {
//           urlPattern: '/item/:id',
//           handler: 'networkFirst'
//         },
//         {
//           urlPattern: '/user/:id',
//           handler: 'networkFirst'
//         }
//       ]
//     })
//   )
// }

module.exports = config;
