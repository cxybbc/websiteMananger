const { defineConfig } = require('@vue/cli-service')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
module.exports = defineConfig({
  devServer: {
    port: 18062,
    host: "0.0.0.0",
    https: false
  },
  // chainWebpack: config => {
  //   // 配置包分析器
  //   config.plugin('webpack-bundle-analyzer')
  //   .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
  // },
  transpileDependencies: true
})
