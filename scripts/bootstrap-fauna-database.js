const faunadb = require("faunadb");

const q = faunadb.query;
let client = null;
if (process.env.REACT_APP_FAUNA_SECRET !== undefined) {
  client = new faunadb.Client({
    secret: process.env.REACT_APP_FAUNA_SECRET,
  });
}

async function testCreateConnection() {
  return new Promise((resolve, reject) => {
    if (client !== null) {
      client
        .query(q.Create(q.Ref("test"), "test"))
        .then((response) => {
          console.log("Success");
          console.log(response);
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    }
  });
}
