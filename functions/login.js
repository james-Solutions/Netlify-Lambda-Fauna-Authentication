exports.handler = (event, context, callback) => {
  return callback(null, {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTION",
    },
    body: JSON.stringify({ code: 1, message: "Works" }),
  });
};
