const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./app/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.bundle.js",

    /**
     * NOTE: This sets the base path of all of our assets, so every assets
     * will going to be this "/"
     */
    publicPath: "/"
  },
  module: {
    rules: [
      { test: /\.js$/, use: "babel-loader" },
      { test: /\.css$/, use: ["style-loader", "css-loader"] }
    ]
  },
  devServer: {
    // NOTE: If this is not set to true, the browser is going to make requests
    // to the server in order to get assets of every routes like '/popular'
    // It will redirect all assets requests to publicPath "/"
    historyApiFallback: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "app/index.html")
    })
  ]
};
