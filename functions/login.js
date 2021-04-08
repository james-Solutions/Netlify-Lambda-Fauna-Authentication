import crypto from "crypto";

const headers = {
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTION",
};

exports.handler = (event, context, callback) => {
  if (event.httpMethod === "POST") {
    const postData = JSON.parse(event.body);
    const hashedSecret = crypto
      .createHash("sha256")
      .update(postData.email + postData.password)
      .digest("hex");
    return callback(null, {
      statusCode: 200,
      headers,
      body: JSON.stringify({ username: "James", hashedSecret }),
    });
  } else {
    return callback(null, {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: "I am alive" }),
    });
  }
};
