const faunadb = require("faunadb");

/* configure faunaDB & Sparkpost Client with our secrets */
const query = faunadb.query;
const clientFauna = new faunadb.Client({
  secret: process.env.REACT_APP_FAUNA_SECRET,
});

const headers = {
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTION",
};

exports.handler = (event, context, callback) => {
  if (event.httpMethod === "POST") {
    const userData = JSON.parse(event.body);
    if (userData.email && userData.code) {
      updateUserVerification(userData.email)
        .then((response) => {
          if (response === "Success") {
            deleteUserCode(userData.email)
              .then((response) => {
                return callback(null, {
                  statusCode: 200,
                  headers: headers,
                  body: JSON.stringify({ message: "Success" }),
                });
              })
              .catch((error) => {
                return callback(null, {
                  statusCode: 200,
                  headers: headers,
                  body: JSON.stringify({
                    message: "Failure",
                    description: error,
                  }),
                });
              });
          } else {
            return callback(null, {
              statusCode: 200,
              headers: headers,
              body: JSON.stringify({
                message: "Failure",
                description: response,
              }),
            });
          }
        })
        .catch((error) => {
          return callback(null, {
            statusCode: 200,
            headers: headers,
            body: JSON.stringify({ message: "Failure", description: error }),
          });
        });
    } else {
      getUserVerificationCode(userData.email)
        .then((response) => {
          return callback(null, {
            statusCode: 200,
            headers: headers,
            body: JSON.stringify({ message: "Success", code: response }),
          });
        })
        .catch((error) => {
          return callback(null, {
            statusCode: 200,
            headers: headers,
            body: JSON.stringify({ message: "Failure", description: error }),
          });
        });
    }
  } else {
    return callback(null, {
      statusCode: 200,
      headers: headers,
      body: JSON.stringify({ message: "Alive" }),
    });
  }
};

async function getUserVerificationCode(email) {
  return new Promise((resolve, reject) => {
    let helper = clientFauna.paginate(
      query.Match(query.Index("users_codes_by_email"), email)
    );
    let response;
    helper
      .map((ref) => {
        return query.Get(ref);
      })
      .each((page) => {
        if (page.length > 0) {
          response = page[0].data.code;
        }
      })
      .then(() => {
        resolve(response);
      });
  });
}

async function updateUserVerification(email) {
  return new Promise((resolve, reject) => {
    clientFauna
      .query(
        query.Update(
          query.Select(
            ["ref"],
            query.Get(query.Match(query.Index("users_by_email"), email))
          ),
          {
            data: {
              verified: true,
            },
          }
        )
      )
      .then((response) => {
        resolve("Success");
      })

      .catch((error) => {
        reject(error);
      });
  });
}

async function deleteUserCode(email) {
  return new Promise((resolve, reject) => {
    clientFauna
      .query(
        query.Delete(
          query.Select(
            ["ref"],
            query.Get(query.Match(query.Index("users_codes_by_email"), email))
          )
        )
      )
      .then((response) => {
        resolve("Success");
      })

      .catch((error) => {
        reject(error);
      });
  });
}
