module.exports = {
    css: {
        loaderOptions: {
            less: {
                javascriptEnabled: true
            }
        }
    },
    devServer: {
        proxy: {
            '/api': {
                target: 'http://localhost:8008',
                // ws: true,
                changeOrigin: true,
                // pathRewrite: {
                //     '^/api': '/'
                // }
            }
        }
    }
}