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

let domainUrl = process.env.REACT_APP_DEV
  ? "https://localhost:3000"
  : "https://modest-cori-434d1e.netlify.app";

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

function createUserCode(email, code) {
  return clientFauna.query(
    query.Create(query.Collection("users_verification_codes"), {
      data: {
        email,
        code,
      },
    })
  );
}

exports.handler = (event, context, callback) => {
  if (event.httpMethod === "POST") {
    const userData = JSON.parse(event.body);
    createUser(userData)
      .then((user) => {
        const code = Math.floor(100000 + Math.random() * 900000);
        // Create the one time code
        createUserCode(userData.email, code)
          .then((response) => {
            // Send Email
            clientSparkpost.transmissions
              .send({
                content: {
                  from: "verification@sparkpost.studying.solutions",
                  subject: `${userData.username}, email verification for SSP Account`,
                  html: `
                  <html>
                    <body>
                      <p>Thank you for signing up for the Student Scheduler Planner (SSP).</p>
                      <p>Please <a href=${domainUrl}/${userData.email}>click me</a> to verify your email.</p>
                      <p>Use code <span style="color:red">${code}</span> to complete your verification.</p>
                      <p>Once your account has been verified and approved, you will be able to login.</p>
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
                  body: JSON.stringify({
                    message: "Failure",
                    description: error,
                  }),
                });
              });
          })
          .catch((error) => {
            console.log(error);
            return callback(null, {
              statusCode: 200,
              headers: headers,
              body: JSON.stringify({ message: "Failure", description: error }),
            });
          });
      })
      .catch((e) => {
        console.error(e);
        return callback(null, {
          statusCode: 400,
          headers: headers,
          body: JSON.stringify({ message: "Failure", description: e }),
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
