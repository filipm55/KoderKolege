const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "https://bytepitb-myjy.onrender.com/",
      changeOrigin: true,
      onProxyRes: function (proxyRes, req, res) {
        res.setHeader('Access-Control-Allow-Origin', 'https://bytepit-gxla.onrender.com/');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      }
    })
  );
};
