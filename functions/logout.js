const faunadb = require("faunadb");

/* configure faunaDB Client with our secret */
const query = faunadb.query;
const client = new faunadb.Client({
  secret: process.env.REACT_APP_FAUNA_SECRET,
});

const headers = {
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTION",
};

exports.handler = (event, context, callback) => {
  if (event.httpMethod === "GET") {
    client
      .query(query.Logout(true))
      .then((response) => {
        console.log(response);
        if (response === true) {
          return callback(null, {
            statusCode: 200,
            headers,
            body: JSON.stringify({ message: "Success" }),
          });
        } else {
          return callback(null, {
            statusCode: 400,
            headers,
            body: JSON.stringify({ message: "Failure" }),
          });
        }
      })
      .catch((error) => {
        return callback(null, {
          statusCode: 400,
          headers,
          body: JSON.stringify({ message: "Failure" }),
        });
      });
  } else {
    return callback(null, {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: "I am alive" }),
    });
  }
};
