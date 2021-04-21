const faunadb = require("faunadb");
const constants = require("../api-utils/constants");

/* configure faunaDB Client with our secret */
const query = faunadb.query;
const clientFauna = new faunadb.Client({
  secret: process.env.REACT_APP_FAUNA_SECRET,
});

/**
 * createUser - Takes in an object containing the users email, username, password, and requested access level.
 * @param {object} userData
 * @returns {Promise} Returns a Promise from the Fauna Client
 */
export function createUser(userData) {
  return clientFauna.query(
    query.Create(query.Collection("users"), {
      credentials: {
        password: userData.password,
      },
      data: {
        email: userData.email,
        username: userData.username,
        accessLevel: userData.accessLevel,
        verified: false,
        approved: false,
      },
    })
  );
}

/**
 * createUserCode - Takes in the email and code to be created for the user
 * @param {string} email
 * @param {number} code
 * @returns {Promise} Promise from the Fauna Client
 */
export function createUserCode(email, code) {
  return clientFauna.query(
    query.Create(query.Collection("users_verification_codes"), {
      data: {
        email,
        code,
      },
    })
  );
}

/**
 * deleteUserCode - Once a user has verified their code, we delete it in Fauna.
 * @param {string} email
 * @returns {Promise} Promise from the Fauna Client once the delete was successful or not
 */
export async function deleteUserCode(email) {
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
        resolve(constants.STATUS.SUCCESS);
      })

      .catch((error) => {
        reject(error);
      });
  });
}

/**
 * getUserVerificationCode - Gets the users code from the FaunaDB based on the email passed in the parameters.
 * @param {string} email
 * @returns {Promise} Promise that if resolved returns the code and rejection will return an error message as a string.
 */
export async function getUserVerificationCode(email) {
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
        if (response === undefined) {
          reject(constants.USER_ERRORS.NO_CODE);
        } else {
          resolve(response);
        }
      })
      .catch((error) => reject(error));
  });
}

/**
 * updateUserVerification - Sets the users' verified flag to true in the FaunaDB.
 * @param {string} email
 * @returns {Promise} Promise from the Fauna Client once the update is completed or failed.
 */
export async function updateUserVerification(email) {
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
        resolve(constants.STATUS.SUCCESS);
      })

      .catch((error) => {
        reject(error);
      });
  });
}

/**
 * getUserVerifyApprove - Returns an object containing two fields, verify and approve, based on the FaunaDB State.
 * @param {string} email
 * @returns {Promise} Promise from the Fauna Client
 */
export async function getUserVerifyApprove(email) {
  return new Promise((resolve, reject) => {
    let helper = clientFauna.paginate(
      query.Match(query.Index("users_by_email"), email)
    );
    const response = {
      verified: false,
      approved: false,
    };
    helper
      .map((ref) => {
        return query.Get(ref);
      })
      .each((page) => {
        if (page.length > 0) {
          response.verified = page[0].data.verified;
          response.approved = page[0].data.approved;
        } else {
          reject(constants.USER_ERRORS.USER_DOES_NOT_EXIST);
        }
      })
      .then(() => {
        resolve(response);
      })
      .catch((error) => reject(error));
  });
}

/**
 * loginAndGetToken - Attempts to login the user and returns the result from the Fauna client that contains key value pairs about the user.
 * @param {object} userData
 * @returns {Promise} Promise from the Fauna Client in the form of an object with the key and other information
 */
export async function loginAndGetToken(userData) {
  const { email, password } = userData;
  return clientFauna.query(
    query.Login(query.Match(query.Index("users_by_email"), email), { password })
  );
}
