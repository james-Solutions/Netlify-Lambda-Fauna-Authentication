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

function createUser(userData) {
  return client.query(
    query.Create(query.Collection("users"), {
      credentials: {
        password: userData.password,
      },
      data: {
        email: userData.email,
        username: userData.username,
        accessLevel: userData.accessLevel,
        verified: false,
        approved: false,
      },
    })
  );
}

exports.handler = (event, context, callback) => {
  if (event.httpMethod === "POST") {
    const userData = JSON.parse(event.body);
    createUser(userData)
      .then((user) => {
        console.log(`User created: ${user}`);
        return callback(null, {
          statusCode: 200,
          headers: headers,
          body: JSON.stringify({ message: "Successful" }),
        });
      })
      .catch((e) => {
        console.error(e);
        return callback(null, {
          statusCode: 400,
          headers: headers,
          body: JSON.stringify({ message: "Failure" }),
        });
      });
  } else {
    return callback(null, {
      statusCode: 200,
      headers: headers,
      body: JSON.stringify({ message: "Alive" }),
    });
  }
};
