const {
  createUser,
  createUserCode,
  sendVerifyCode,
  generateCode,
} = require("../api-utils/User");
const constants = require("../api-utils/constants");

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
                    headers: constants.HEADERS,
                    body: JSON.stringify({ message: constants.STATUS.SUCCESS }),
                  });
                }
              })
              .catch((error) => {
                return callback(null, {
                  statusCode: 200,
                  headers: constants.HEADERS,
                  body: JSON.stringify({
                    message: constants.STATUS.FAILURE,
                    description: error,
                  }),
                });
              });
          })
          .catch((error) => {
            return callback(null, {
              statusCode: 200,
              headers: constants.HEADERS,
              body: JSON.stringify({
                message: constants.STATUS.FAILURE,
                description: error,
              }),
            });
          });
      })
      .catch((error) => {
        console.error(error);
        if (error.description === constants.FAUNA_ERRORS.NOT_UNIQUE) {
          return callback(null, {
            statusCode: 200,
            headers: constants.HEADERS,
            body: JSON.stringify({
              message: constants.STATUS.FAILURE,
              description: constants.USER_ERRORS.USER_NOT_UNIQUE,
            }),
          });
        } else {
          return callback(null, {
            statusCode: 200,
            headers: constants.HEADERS,
            body: JSON.stringify({
              message: constants.STATUS.FAILURE,
              description: error.description,
            }),
          });
        }
      });
  } else {
    return callback(null, {
      statusCode: 200,
      headers: constants.HEADERS,
      body: JSON.stringify({ message: constants.STATUS.ALIVE }),
    });
  }
};
