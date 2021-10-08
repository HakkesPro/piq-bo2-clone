// import AppConfig from './src/app-config'
const createProxyMiddleware = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/paymentiq/api-proxy',
    createProxyMiddleware({
      target: 'http://localhost:3030', // server needs to be served from '/workspaces/server'
      changeOrigin: true,
      headers: {
        Connection: 'keep-alive',
        Host: 'localhost:3030',
      },
    })
  );
  app.use(
    '/paymentiq',
    createProxyMiddleware({
      target: 'https://test-dev.paymentiq.io:443',
      changeOrigin: true,
      headers: {
        Connection: 'keep-alive',
        Host: 'test-dev.paymentiq.io',
      },
    })
  );
};
