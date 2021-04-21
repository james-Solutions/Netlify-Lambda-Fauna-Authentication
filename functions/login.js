const faunadb = require("faunadb");
const {
  getUserVerifyApprove,
  loginAndGetToken,
  getUserData,
} = require("../api-utils/User");
const constants = require("../api-utils/constants");

/* configure faunaDB Client with our secret */
const query = faunadb.query;
const client = new faunadb.Client({
  secret: process.env.REACT_APP_FAUNA_SECRET,
});

exports.handler = (event, context, callback) => {
  if (event.httpMethod === "POST") {
    const postData = JSON.parse(event.body);
    // First we need to see if the user is verified and approved
    getUserVerifyApprove(postData.email)
      .then((response) => {
        if (response.verified === false) {
          return callback(null, {
            statusCode: 200,
            headers: constants.HEADERS,
            body: JSON.stringify({
              message: constants.STATUS.FAILURE,
              description: constants.USER_ERRORS.USER_NOT_VERIFIED,
            }),
          });
        } else if (response.approved === false) {
          return callback(null, {
            statusCode: 200,
            headers: constants.HEADERS,
            body: JSON.stringify({
              message: constants.STATUS.FAILURE,
              description: constants.USER_ERRORS.USER_NOT_APPROVED,
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
              getUserData(postData.email)
                .then((user) => {
                  return callback(null, {
                    statusCode: 200,
                    headers: constants.HEADERS,
                    body: JSON.stringify({
                      message: constants.STATUS.SUCCESS,
                      secret: response.secret,
                      username: user.username,
                      accessLevel: user.accessLevel,
                    }),
                  });
                })
                .catch((error) => {
                  return callback(null, {
                    statusCode: 200,
                    headers: constants.HEADERS,
                    body: JSON.stringify({
                      message: constants.STATUS.FAILURE,
                      description: error.description,
                    }),
                  });
                });
            })
            .catch((error) => {
              console.log(error);
              return callback(null, {
                statusCode: 200,
                headers: constants.HEADERS,
                body: JSON.stringify({
                  message: constants.STATUS.FAILURE,
                  description: error.description,
                }),
              });
            });
        }
      })
      .catch((error) => {
        console.log(error);
        return callback(null, {
          statusCode: 200,
          headers: constants.HEADERS,
          body: JSON.stringify({
            message: constants.STATUS.FAILURE,
            description: error,
          }),
        });
      });
  } else if (event.httpMethod === "GET") {
    client
      .query(query.Logout(false))
      .then((response) => {
        console.log(response);
        if (response === true) {
          return callback(null, {
            statusCode: 200,
            headers: constants.HEADERS,
            body: JSON.stringify({ message: constants.STATUS.SUCCESS }),
          });
        } else {
          return callback(null, {
            statusCode: 200,
            headers: constants.HEADERS,
            body: JSON.stringify({ message: constants.STATUS.FAILURE }),
          });
        }
      })
      .catch((error) => {
        return callback(null, {
          statusCode: 200,
          headers: constants.HEADERS,
          body: JSON.stringify({ message: constants.STATUS.FAILURE }),
        });
      });
  } else {
    return callback(null, {
      statusCode: 200,
      headers: constants.HEADERS,
      body: JSON.stringify({ message: constants.STATUS.ALIVE }),
    });
  }
};
