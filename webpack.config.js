var webpack = require("webpack");
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const LiveReloadPlugin = require("webpack-livereload-plugin");
const isDev = process.env.NODE_ENV === "development";

module.exports = {
  entry: [
    "@babel/polyfill", // enables async-await
    "./client/index.js"
  ],
  output: {
    path: __dirname,
    filename: "./public/bundle.js"
  },
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: "babel-loader"
      },
      {
        test: /\.css$/,
        use: ["style-loader", 'css-loader?url=false']
      },
      {
        test: /\.scss$/,
        use: ["style-loader", 'css-loader?url=false', "sass-loader"]
      },
      {
        test: /\.svg$|\.ttf?|\.woff$|\.woff2|\.eof|\.eot/,
        loader: "file-loader"
      }
    ]
  },
  // When we're in development, we can use this handy live-reload plugin
  // to refresh the page for us every time we make a change to our client-side
  // files. It's like `nodemon` for the front end!
  plugins: isDev
    ? [
        new HardSourceWebpackPlugin(),
        new webpack.ProvidePlugin({
          $: "jquery",
          jQuery: "jquery",
          "window.jQuery": "jquery",
          Tether: "tether",
          Popper: ["popper.js", "default"]
        }),
        new LiveReloadPlugin({ appendScriptTag: true })
      ]
    : [
        new HardSourceWebpackPlugin(),
        new webpack.ProvidePlugin({
          $: "jquery",
          jQuery: "jquery",
          "window.jQuery": "jquery",
          Tether: "tether",
          Popper: ["popper.js", "default"]
        })
      ]
};
