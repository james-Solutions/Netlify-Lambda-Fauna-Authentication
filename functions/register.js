const faunadb = require("faunadb");
const SparkPost = require("sparkpost");

/* configure faunaDB & Sparkpost Client with our secrets */
const query = faunadb.query;
const clientFauna = new faunadb.Client({
  secret: process.env.REACT_APP_FAUNA_SECRET,
});
const clientSparkpost = new SparkPost(process.env.REACT_APP_SPARKPOST);

const headers = {
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTION",
};

function createUser(userData) {
  return clientFauna.query(
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
        // Send Email
        clientSparkpost.transmissions
          .send({
            content: {
              from: "verification@sparkpost.studying.solutions",
              subject: `${userData.username}, email verification for SSP Account`,
              html: `
              <html>
                <body>
                  <p>My cool email.</p>
                </body>
              </html>`,
            },
            recipients: [{ address: userData.email }],
          })
          .then((data) => {
            console.log(data);
            return callback(null, {
              statusCode: 200,
              headers: headers,
              body: JSON.stringify({ message: "Successful" }),
            });
          })
          .catch((error) => {
            console.log(error);
            return callback(null, {
              statusCode: 200,
              headers: headers,
              body: JSON.stringify({ message: "Failure" }),
            });
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
