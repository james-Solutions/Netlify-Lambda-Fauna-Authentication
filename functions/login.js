exports.handler = (event, context, callback) => {
  console.log("hello");
  return callback(null, {
    statusCode: 200,
    body: { code: 1, message: "Works" },
  });
};
