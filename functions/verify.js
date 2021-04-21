const {
  updateUserVerification,
  deleteUserCode,
  getUserVerificationCode,
  getUserVerifyApprove,
  createUserCode,
  generateCode,
  sendVerifyCode,
} = require("../api-utils/User");
const constants = require("../api-utils/constants");

/* configure faunaDB & Sparkpost Client with our secrets */

exports.handler = (event, context, callback) => {
  if (event.httpMethod === "POST") {
    const userData = JSON.parse(event.body);
    if (userData.email && userData.code) {
      updateUserVerification(userData.email)
        .then((response) => {
          if (response === constants.STATUS.SUCCESS) {
            deleteUserCode(userData.email)
              .then((response) => {
                return callback(null, {
                  statusCode: 200,
                  headers: constants.HEADERS,
                  body: JSON.stringify({ message: constants.STATUS.SUCCESS }),
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
          } else {
            return callback(null, {
              statusCode: 200,
              headers: constants.HEADERS,
              body: JSON.stringify({
                message: constants.STATUS.FAILURE,
                description: response,
              }),
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
    } else {
      getUserVerificationCode(userData.email)
        .then((response) => {
          return callback(null, {
            statusCode: 200,
            headers: constants.HEADERS,
            body: JSON.stringify({
              message: constants.STATUS.SUCCESS,
              code: response,
            }),
          });
        })
        .catch((error) => {
          if (error === constants.USER_ERRORS.NO_CODE) {
            getUserVerifyApprove(userData.email)
              .then((response) => {
                if (response.verified === true) {
                  return callback(null, {
                    statusCode: 200,
                    headers: constants.HEADERS,
                    body: JSON.stringify({
                      message: constants.STATUS.FAILURE,
                      description: constants.USER_ERRORS.ALREADY_VERIFIED,
                    }),
                  });
                } else {
                  // Should we just make a new code?
                  const code = generateCode();
                  createUserCode(userData.email, code)
                    .then((response) => {
                      // Send email with code
                      sendVerifyCode(userData, code)
                        .then((response) => {
                          if (response === constants.STATUS.SUCCESS) {
                            return callback(null, {
                              statusCode: 200,
                              headers: constants.HEADERS,
                              body: JSON.stringify({
                                message: constants.STATUS.SUCCESS,
                                description:
                                  constants.USER_ERRORS.NO_CODE_UNVERIFIED,
                                code: code,
                              }),
                            });
                          } else {
                            return callback(null, {
                              statusCode: 200,
                              headers: constants.HEADERS,
                              body: JSON.stringify({
                                message: constants.STATUS.FAILURE,
                              }),
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
                }
              })
              .catch((error) => {
                if (error === constants.USER_ERRORS.USER_DOES_NOT_EXIST) {
                  return callback(null, {
                    statusCode: 200,
                    headers: constants.HEADERS,
                    body: JSON.stringify({
                      message: constants.STATUS.FAILURE,
                      description: error,
                    }),
                  });
                }
              });
          }
        });
    }
  } else {
    return callback(null, {
      statusCode: 200,
      headers: constants.HEADERS,
      body: JSON.stringify({ message: constants.STATUS.ALIVE }),
    });
  }
};
