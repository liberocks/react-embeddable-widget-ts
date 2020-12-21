const path = require("path");
const webpack = require("webpack");

const TerserWebpackPlugin = require("terser-webpack-plugin");
const bundleOutputDir = "./dist";

module.exports = (env) => {
  const isProductionBuild = process.env.NODE_ENV === "production";

  return [
    {
      entry: "./src/main.tsx",
      mode: isProductionBuild ? "production" : "development",
      output: {
        filename: "widget.js",
        path: path.resolve(bundleOutputDir),
      },
      resolve: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
      module: {
        rules: [
          {
            test: /\.(ts|tsx|js|jsx)$/,
            exclude: /node_modules/,
            use: ["babel-loader"],
          },
          {
            test: /\.css$/i,
            use: ["style-loader", "css-loader"],
          },
        ],
      },
      devServer: {
        contentBase: bundleOutputDir,
      },
      optimization: isProductionBuild
        ? {
            minimizer: [new TerserWebpackPlugin()],
          }
        : {},
    },
  ];
};
