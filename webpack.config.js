const path = require('path');

module.exports = {
  entry: './handler.js',
  target: 'node',
  mode: 'production',
  optimization: {
    minimize: false
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js']
  },
  output: {
    libraryTarget: 'commonjs2',
    path: path.join(__dirname, '.webpack'),
    filename: 'handler.js'
  },
  externals: [
    'aws-sdk',
    // Native modules that should not be bundled
    /^@node-rs\/.*/,
    'nodejieba',
    'kuroshiro-analyzer-kuromoji',
    'canvas',
    'sharp',
    // Native dependencies that cause issues
    '@mapbox/node-pre-gyp',
    'mock-aws-s3',
    'nock',
    'node-gyp',
    'npm',
    // Binary files and native addons
    /\.node$/,
    /\.wasm$/
  ],
  node: {
    // Tell webpack to polyfill or ignore certain Node.js globals
    __dirname: false,
    __filename: false,
  },
  plugins: [],
  ignoreWarnings: [
    /Critical dependency/,
    /Module not found/
  ]
}; 