const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const AutoDllPlugin = require("autodll-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;

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
    noParse: function(content) {
      return /lodash/.test(content);
    },
    rules: [
      {
        test: /\.js$/,
        include: [path.resolve(__dirname, "app")],
        use: ["thread-loader", "babel-loader"]
      },
      {
        test: /\.css$/,
        include: [path.resolve(__dirname, "app")],
        use: ["thread-loader", "style-loader", "css-loader"]
      }
    ]
  },
  devServer: {
    // NOTE: If this is not set to true, the browser is going to make requests
    // to the server in order to get assets of every routes like '/popular'
    // It will redirect all assets requests to publicPath "/"
    historyApiFallback: true
  },
  devtool: "cheap-source-map",
  plugins: [
    new BundleAnalyzerPlugin(),
    new HtmlWebpackPlugin({
      inject: true,
      template: path.resolve(__dirname, "app/index.html")
    }),
    new AutoDllPlugin({
      inject: true,
      debug: true,
      filename: "[name]_[hash].dll.js",
      path: "./dll",
      entry: {
        vendor: ["react", "react-dom", "lodash"]
      }
    })
  ]
};
