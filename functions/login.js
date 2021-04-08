import crypto from "crypto";

const headers = {
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTION",
};

exports.handler = (event, context, callback) => {
  if (event.httpMethod === "POST") {
    const hashedSecret = crypto
      .createHash("sha256")
      .update("event.body.password")
      .digest("base64");
    return callback(null, {
      statusCode: 200,
      headers,
      body: JSON.stringify({ username: "Bob", hashedSecret }),
    });
  } else {
    return callback(null, {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: "I am alive" }),
    });
  }
};
