const path = require("path");

const baseConfig = {
  entry: {
    "mfuns-advanced-danmaku": "./src/index.ts",
  },
  devtool: "source-map",
  resolve: {
    extensions: [".js", ".ts", ".json"],
    alias: {
      src: path.join(__dirname, "./src"),
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              transpileOnly: true,
            },
          },
        ],
      },
    ],
  },
};

const umdConfig = Object.assign({}, baseConfig, {
  output: {
    path: path.resolve(__dirname, "lib"),
    filename: "[name].js",
    libraryTarget: 'umd',
    library: 'MfunsAdvancedDanmaku',
    libraryExport: "MfunsAdvancedDanmaku",
  },
})

module.exports = [umdConfig]