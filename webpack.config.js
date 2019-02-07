const HtmlPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  entry: "./dev.jsx",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader"
      },
      {
        test: /\.jsx?$/,
        loader: "babel-loader"
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js']
  },
  plugins: [
    new HtmlPlugin({
      template: "./index.html"
    })
  ]
};
