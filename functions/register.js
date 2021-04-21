const {
  createUser,
  createUserCode,
  sendVerifyCode,
  generateCode,
} = require("../api-utils/User");
const SparkPost = require("sparkpost");
const constants = require("../api-utils/constants");

/* configure parkpost Client with our secrets */
const clientSparkpost = new SparkPost(process.env.REACT_APP_SPARKPOST);

const headers = {
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTION",
};

exports.handler = (event, context, callback) => {
  if (event.httpMethod === "POST") {
    const userData = JSON.parse(event.body);
    createUser(userData)
      .then((user) => {
        const code = generateCode();
        // Create the one time code
        createUserCode(userData.email, code)
          .then((response) => {
            // Send Email
            sendVerifyCode(userData, code)
              .then((response) => {
                if (response === constants.STATUS.SUCCESS) {
                  return callback(null, {
                    statusCode: 200,
                    headers: headers,
                    body: JSON.stringify({ message: constants.STATUS.SUCCESS }),
                  });
                }
              })
              .catch((error) => {
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
