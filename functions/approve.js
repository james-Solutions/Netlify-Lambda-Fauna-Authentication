const constants = require("../api-utils/constants");
const {
  getUnapprovedUsers,
  updateUserApproval,
  sendApprovalUpdateEmail,
  getRejectedUsers,
  getAllApprovedUsers,
} = require("../api-utils/User");

exports.handler = (event, context, callback) => {
  if (event.httpMethod === "POST") {
    const postData = JSON.parse(event.body);
    if (postData.email) {
      // Update the user in the FaunaDB
      updateUserApproval(postData.email, postData.approved)
        .then((response) => {
          if (response === constants.SERVER.STATUS.SUCCESS) {
            sendApprovalUpdateEmail(postData.email, postData.approved)
              .then((response) => {
                if (response === constants.SERVER.STATUS.SUCCESS) {
                  return callback(null, {
                    statusCode: 200,
                    headers: constants.SERVER.HEADERS,
                    body: JSON.stringify({
                      message: constants.SERVER.STATUS.SUCCESS,
                    }),
                  });
                } else {
                  return callback(null, {
                    statusCode: 200,
                    headers: constants.SERVER.HEADERS,
                    body: JSON.stringify({
                      message: constants.SERVER.STATUS.FAILURE,
                      description: response,
                    }),
                  });
                }
              })
              .catch((error) => {
                return callback(null, {
                  statusCode: 200,
                  headers: constants.SERVER.HEADERS,
                  body: JSON.stringify({
                    message: constants.SERVER.STATUS.FAILURE,
                    description: error,
                  }),
                });
              });
          } else {
            return callback(null, {
              statusCode: 200,
              headers: constants.SERVER.HEADERS,
              body: JSON.stringify({
                message: constants.SERVER.STATUS.FAILURE,
                description: response,
              }),
            });
          }
        })
        .catch((error) => {
          return callback(null, {
            statusCode: 200,
            headers: constants.SERVER.HEADERS,
            body: JSON.stringify({
              message: constants.SERVER.STATUS.FAILURE,
              description: error,
            }),
          });
        });
    } else if (postData.type) {
      if (postData.type === constants.USER.STATUS.PENDING) {
        getUnapprovedUsers()
          .then((response) => {
            return callback(null, {
              statusCode: 200,
              headers: constants.SERVER.HEADERS,
              body: JSON.stringify({
                message: constants.SERVER.STATUS.SUCCESS,
                users: response,
              }),
            });
          })
          .catch((error) => {
            return callback(null, {
              statusCode: 200,
              headers: constants.SERVER.HEADERS,
              body: JSON.stringify({
                message: constants.SERVER.STATUS.FAILURE,
                description: error,
              }),
            });
          });
      } else if (postData.type === constants.USER.STATUS.REJECTED) {
        getRejectedUsers()
          .then((response) => {
            return callback(null, {
              statusCode: 200,
              headers: constants.SERVER.HEADERS,
              body: JSON.stringify({
                message: constants.SERVER.STATUS.SUCCESS,
                users: response,
              }),
            });
          })
          .catch((error) => {
            return callback(null, {
              statusCode: 200,
              headers: constants.SERVER.HEADERS,
              body: JSON.stringify({
                message: constants.SERVER.STATUS.FAILURE,
                description: error,
              }),
            });
          });
      } else if (postData.type === constants.USER.STATUS.APPROVED) {
        getAllApprovedUsers()
          .then((response) => {
            return callback(null, {
              statusCode: 200,
              headers: constants.SERVER.HEADERS,
              body: JSON.stringify({
                message: constants.SERVER.STATUS.SUCCESS,
                users: response,
              }),
            });
          })
          .catch((error) => {
            return callback(null, {
              statusCode: 200,
              headers: constants.SERVER.HEADERS,
              body: JSON.stringify({
                message: constants.SERVER.STATUS.FAILURE,
                description: error,
              }),
            });
          });
      }
    }
  } else if (event.httpMethod === "OPTIONS") {
    return callback(null, {
      statusCode: 200,
      headers: constants.SERVER.HEADERS,
      body: JSON.stringify({ message: constants.SERVER.STATUS.ALIVE }),
    });
  }
};
