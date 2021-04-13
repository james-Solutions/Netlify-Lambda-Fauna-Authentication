const faunadb = require("faunadb");

/* configure faunaDB Client with our secret */
const q = faunadb.query;
const client = new faunadb.Client({
  secret: process.env.MY_FAUNA_SECRET,
});

/* create a user in FaunaDB that can connect from the browser */
function createUser(userData) {
  return client.query(
    q.Create(q.Collection("users"), {
      credentials: {
        password: userData.password,
      },
      data: {
        email: userData.email,
      },
    })
  );
}

function loginAndGetToken(userData) {
  const { email, password } = userData;
  return client.query(
    q.Login(q.Match(q.Index("users_by_email"), email), { password })
  );
  //   return client.query(q.Login(q.Select(email, "users"), { email, password }));
}

const email = "test@test.com";
const password = "test12345";

const userData = {
  email: email,
  password: password,
};

loginAndGetToken(userData)
  .then((res) => {
    console.log("Response: ");
    console.log(res);
  })
  .catch((err) => {
    console.log("Error!");
    console.log(err);
  });

// createUser(userData)
//   .then((user) => {
//     console.log(`User created: ${user}`);
//     obtainToken(user, password);
//   })
//   .then((key) => {
//     console.log(`User secret key: ${key.secret}`);
//     console.log(key);
//   })
//   .catch((e) => {
//     console.error(e);
//   });
