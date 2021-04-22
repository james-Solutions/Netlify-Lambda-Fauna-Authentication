const constants = require("../api-utils/constants");
const { getUnapprovedUsers, updateUserApproval } = require("../api-utils/User");

exports.handler = (event, context, callback) => {
  if (event.httpMethod === "POST") {
    const postData = JSON.parse(event.body);
    if (postData.email) {
      // Update the user in the FaunaDB
      updateUserApproval(postData.email, postData.approved)
        .then((response) => {
          if (response === constants.STATUS.SUCCESS) {
            return callback(null, {
              statusCode: 200,
              headers: constants.HEADERS,
              body: JSON.stringify({
                message: constants.STATUS.SUCCESS,
              }),
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
    }
  } else if (event.httpMethod === "GET") {
    getUnapprovedUsers()
      .then((response) => {
        return callback(null, {
          statusCode: 200,
          headers: constants.HEADERS,
          body: JSON.stringify({
            message: constants.STATUS.SUCCESS,
            users: response,
          }),
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
  } else if (event.httpMethod === "OPTIONS") {
    return callback(null, {
      statusCode: 200,
      headers: constants.HEADERS,
      body: JSON.stringify({ message: constants.STATUS.ALIVE }),
    });
  }
};
