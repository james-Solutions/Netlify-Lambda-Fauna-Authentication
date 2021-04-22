const constants = require("../api-utils/constants");
const { getUnverifiedUsers } = require("../api-utils/User");

exports.handler = (event, context, callback) => {
  if (event.httpMethod === "POST") {
  } else if (event.httpMethod === "GET") {
    getUnverifiedUsers()
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
