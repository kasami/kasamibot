module.exports = {
  entry: "./src/main.ts",
  output: {
    filename: "./main.js",
    pathinfo: false,
    libraryTarget: "commonjs2",
    devtoolModuleFilenameTemplate: '[resource-path]',
  },

  target: "node",

  node: {
    console: true,
    global: true,
    process: false,
    Buffer: false,
    __filename: false,
    __dirname: false,
  },

  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: ['', '.js', '.ts', '.d.ts', '.tsx']
  },

  externals: [
    {
        // webpack will not try to rewrite require("main.js.map")
        "main.js.map": "./main.js.map",
    },
  ],

  module: {
    loaders: [
      // All files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'.
      { test: /\.tsx?$/, loader: "ts-loader" },
    ],
    preLoaders: [
      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      { test: /\.js$/, loader: "source-map-loader" }
    ]
  },
};
