/**
 *webpack 相关配置
 */
const proxyConfig = require("./proxy.config");
module.exports = {
  lintOnSave: process.env.NODE_ENV !== "production",
  devServer: {
    host: "0.0.0.0",
    port: "8090",
    https: false,
    open: true,
    proxy: proxyConfig.proxy
  }
};
