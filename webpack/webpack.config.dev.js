const webpack = require("webpack");
const path = require("path");
const htmlWebpackPlugin = require("html-webpack-plugin");

process.env.NODE_ENV = "development";

module.exports = {
  mode: "development",
  target: "web",
  devtool: "cheap-module-source-map",
  entry: "./src/index",
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js"],
  },
  output: {
    path: path.resolve(__dirname, "..", "build"),
    publicPath: "/",
    filename: "bundle.js",
  },
  node: {
    net: "empty", // added because of stompjs issue where it can't resolve net
  },
  devServer: {
    open: true,
    stats: "minimal",
    overlay: true,
    historyApiFallback: true,
    // disableHostCheck: true,
    // headers: { "Access-Control-Allow_Origin": "*" },
    // https: false
  },
  plugins: [
    new htmlWebpackPlugin({
      template: "./src/index.html",
      //   favicon: "../src/favicon.ico"  // TODO - get a favicon and uncomment this line
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: ["babel-loader", "eslint-loader"],
      },
      {
        test: /(\.css)$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
};
