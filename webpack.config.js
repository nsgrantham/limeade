module.exports = {
  entry: './js/main.js',
  output: {
    path: __dirname,
    filename: 'bundle.js',
    library: 'limeade'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  }
};