/**
 * 代理配置
 * http://index.test.talcloud.com
 * http://www.taltest.com
 * http://www.talcloud.com
 * @type {string}
 */
const proxyUrl = "http://www.taltest.com";

module.exports = {
  proxy: {
    "/api": {
      target: proxyUrl,
      changeOrigin: true,
      cookieDomainRewrite: {
        "unchanged.domain": "unchanged.domain",
        "old.domain": "new.domain",
        "*": ""
      }
    },
    "/tal": {
      target: proxyUrl,
      changeOrigin: true,
      cookieDomainRewrite: {
        "unchanged.domain": "unchanged.domain",
        "old.domain": "new.domain",
        "*": ""
      }
    },
    "/res": {
      target: proxyUrl,
      changeOrigin: true,
      cookieDomainRewrite: {
        "unchanged.domain": "unchanged.domain",
        "old.domain": "new.domain",
        "*": ""
      }
    }
  }
};
