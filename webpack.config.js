module.exports = {
  devServer: {
    proxy: {
      '/v1': {
        target: 'https://next-song.app',
        changeOrigin: true,
        pathRewrite: {
          '^/v1': ''
        }
      },
      '/v2': {
        target: 'https://pixelate.app/api',
        changeOrigin: true,
        pathRewrite: {
          '^/v2': ''
        }
      },

    }
  }
}
