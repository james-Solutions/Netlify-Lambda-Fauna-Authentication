import * as proxy from 'http-proxy-middleware'

module.exports = function(app: { use: (arg0: any) => void; }) {
  app.use(proxy('/.netlify/functions/', {
    target: 'http://localhost:9000/',
    "pathRewrite": {
      "^/\\.netlify/functions": ""
    }
  }));
};
