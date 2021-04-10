import * as proxy from "http-proxy-middleware";

module.exports = function (app: { use: (arg0: any) => void }) {
  debugger;
  app.use(
    proxy("/.netlify/functions-build/", {
      target: "http://localhost:9000/",
      pathRewrite: {
        "^/\\.netlify/functions-build": "",
      },
    })
  );
};
