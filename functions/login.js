const faunadb = require("faunadb");
const { get } = require("request-promise");

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
  if (event.httpMethod === "POST") {
    const postData = JSON.parse(event.body);
    // First we need to see if the user is verified and approved
    getUserData(postData.email)
      .then((response) => {
        if (response.verified === false) {
          return callback(null, {
            statusCode: 200,
            headers,
            body: JSON.stringify({
              message: "Failure",
              description: "User has not verified their email.",
            }),
          });
        } else if (response.approved === false) {
          return callback(null, {
            statusCode: 200,
            headers,
            body: JSON.stringify({
              message: "Failure",
              description: "User has not approved to login.",
            }),
          });
        } else {
          // Approved and verified
          // Once verified and approved is true
          loginAndGetToken({
            email: postData.email,
            password: postData.password,
          })
            .then((response) => {
              return callback(null, {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                  message: "Success",
                  secret: response.secret,
                }),
              });
            })
            .catch((error) => {
              console.log("Error!");
              console.log(error);
              const jsonData = JSON.parse(error);
              return callback(null, {
                statusCode: jsonData.requestResult.statusCode,
                headers,
                body: JSON.stringify({
                  message: jsonData.message,
                  description: jsonData.description,
                }),
              });
            });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  } else if (event.httpMethod === "GET") {
    client
      .query(query.Logout(false))
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
            statusCode: 200,
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

async function loginAndGetToken(userData) {
  const { email, password } = userData;
  return client.query(
    query.Login(query.Match(query.Index("users_by_email"), email), { password })
  );
}

async function getUserData(email) {
  let helper = client.paginate(
    query.Match(query.Index("users_by_email"), email)
  );
  const response = {
    verified: false,
    approved: false,
  };
  helper
    .map((ref) => {
      return query.Get(ref);
    })
    .each((page) => {
      if (page.length > 0) {
        response.verified = page[0].data.verified;
        response.approved = page[0].data.approved;
      }
    });
  return response;
}
