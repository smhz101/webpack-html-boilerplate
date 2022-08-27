import Dotenv from "dotenv-webpack";
import path from "path";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import CopyPlugin from "copy-webpack-plugin";

// change these variables to fit your project
const jsPath = "./assets/js";
const cssPath = "./assets/sass";
const outputPath = "dist";
const localDomain = "https://prototype.test";
const entryPoints = {
  // 'app' is the output name, people commonly use 'bundle'
  // you can have more than 1 entry point
  app: jsPath + "/index.js",
  style: cssPath + "/styles.scss",
};

export default {
  // Entry point
  entry: [entryPoints.app, entryPoints.style],

  // Output path
  output: {
    path: path.resolve(process.cwd(), outputPath),
    filename: "[name].js",
  },

  watch: true,

  // Define loaders
  module: {
    rules: [
      // Js rules
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },

      // CSS, PostCSS, and Sass
      {
        test: /\.(scss)$/,
        use: [
          {
            // inject CSS to page
            loader: "style-loader",
          },
          {
            // translates CSS into CommonJS modules
            loader: "css-loader",
          },
          {
            // Run postcss actions
            loader: "postcss-loader",
            options: {
              // `postcssOptions` is needed for postcss 8.x;
              // if you use postcss 7.x skip the key
              postcssOptions: {
                // postcss plugins, can be exported to postcss.config.js
                plugins: function () {
                  return [require("autoprefixer")];
                },
              },
            },
          },
          {
            // compiles Sass to CSS
            loader: "sass-loader",
          },
        ],
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },

  // Define required plugins
  plugins: [
    new Dotenv({ path: "./.env" }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css",
    }),
    new CopyPlugin({ patterns: [{ from: "assets/images", to: "images" }] }),
    new HtmlWebpackPlugin({
      template: path.resolve(process.cwd(), "index.html"),
    }),
  ],

  // DevServe configation
  devServer: {
    static: { directory: path.resolve(process.cwd(), "public") },
    watchFiles: [path.resolve(process.cwd(), "**/*.html")],
    compress: true,
    liveReload: true,
    port: process.env.PORT || 9090,
    hot: true,
  },

  // Performance configuration
  performance: {
    hints: false,
  },
};
