module.exports = {
  entry: './app/entry.js',
  output: {
    path: './',
    filename: 'index.js'
  },
  devServer: {
    port: 4444,
    historyApiFallback: true
  },
  module: {
    loaders: [
      {
      test: /\.js$/,
      loader: 'babel',
      include: `${__dirname}/app`,
      query: {
        presets: ['react', 'es2015', 'stage-0'],
        plugins: ['babel-plugin-transform-decorators-legacy']
      }
    }
    ]
  }
}