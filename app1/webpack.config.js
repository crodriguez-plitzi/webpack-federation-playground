const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;
const path = require("path");
module.exports = {
  entry: "./src/bootstrap",
  mode: "development",
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist')
    },
    port: 3004,
  },
  output: {
    publicPath: "auto",
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: "babel-loader",
        exclude: /node_modules/,
        options: {
          presets: ["@babel/preset-react"],
        },
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "app1",
      filename: "remoteEntry.js",
      remotes: {
        app2: "app2@http://localhost:3005/remoteEntry.js",
      },
      exposes: {
        "./Button": "./src/Button",
      },
      // sharing code based on the installed version, to allow for multiple vendors with different versions
      shared: [
        {
          react: { singleton: true, requiredVersion: false },
          "react-dom": { singleton: true, requiredVersion: false },
          "react-redux": { singleton: true, requiredVersion: false },
        },
      ],
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
};
