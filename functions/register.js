const { createUser, createUserCode } = require("../api-utils/User");
const SparkPost = require("sparkpost");
const constants = require("../api-utils/constants");

/* configure parkpost Client with our secrets */
const clientSparkpost = new SparkPost(process.env.REACT_APP_SPARKPOST);

const headers = {
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTION",
};

let domainUrl = process.env.REACT_APP_DEV
  ? "https://localhost:3000"
  : "https://modest-cori-434d1e.netlify.app";

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
                      <p>Please <a href=${domainUrl}/user/verify/${userData.email}>click me</a> to verify your email.</p>
                      <p>Use code the following code to complete your verification: <span style="color:red">${code}</span></p>
                      <p>Once your account has been verified and approved, you will be able to login.</p>
                    </body>
                  </html>`,
                },
                recipients: [{ address: userData.email }],
              })
              .then((data) => {
                return callback(null, {
                  statusCode: 200,
                  headers: headers,
                  body: JSON.stringify({ message: constants.STATUS.SUCCESS }),
                });
              })
              .catch((error) => {
                console.log(error);
                return callback(null, {
                  statusCode: 200,
                  headers: headers,
                  body: JSON.stringify({
                    message: constants.STATUS.FAILURE,
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
              body: JSON.stringify({
                message: constants.STATUS.FAILURE,
                description: error,
              }),
            });
          });
      })
      .catch((e) => {
        console.error(e);
        return callback(null, {
          statusCode: 400,
          headers: headers,
          body: JSON.stringify({
            message: constants.STATUS.FAILURE,
            description: e,
          }),
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
