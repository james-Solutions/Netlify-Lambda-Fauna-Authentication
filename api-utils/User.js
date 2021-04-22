const faunadb = require("faunadb");
const constants = require("../api-utils/constants");
const SparkPost = require("sparkpost");

/* configure FaunaDB & Sparkpost Client with our secrets */
const clientSparkpost = new SparkPost(process.env.REACT_APP_SPARKPOST);
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
        approved:
          userData.accessLevel === constants.ACCESS_LEVELS.STUDENT
            ? true
            : false,
        rejected: false,
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
 * updateUserApproval - Sets the users' approved flag to true in the FaunaDB.
 * @param {string} email
 * @returns {Promise} Promise from the Fauna Client once the update is completed or failed.
 */
export async function updateUserApproval(email, approved) {
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
              approved,
              rejected: !approved,
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
      rejected: false,
    };
    helper
      .map((ref) => {
        return query.Get(ref);
      })
      .each((page) => {
        if (page.length > 0) {
          response.verified = page[0].data.verified;
          response.approved = page[0].data.approved;
          response.rejected = page[0].data.rejected;
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
 * getUserVerifyData - Returns an object containing two fields, verify and approve, based on the FaunaDB State.
 * @param {string} email
 * @returns {Promise} Promise from the Fauna Client
 */
export async function getUserData(email) {
  return new Promise((resolve, reject) => {
    let helper = clientFauna.paginate(
      query.Match(query.Index("users_by_email"), email)
    );
    const response = {
      email: "",
      username: "",
      accessLevel: "",
      verified: false,
      approved: false,
    };
    helper
      .map((ref) => {
        return query.Get(ref);
      })
      .each((page) => {
        if (page.length > 0) {
          response.email = page[0].data.email;
          response.username = page[0].data.username;
          response.accessLevel = page[0].data.accessLevel;
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

/**
 * sendVerifyCode - Sends the code using the email field in the userData object.
 * @param {object} userData
 * @param {number} code
 * @returns {Promise}
 */
export async function sendVerifyCode(userData, code) {
  return new Promise((resolve, reject) => {
    clientSparkpost.transmissions
      .send({
        content: {
          from: "verification@sparkpost.studying.solutions",
          subject: `SSP Email Verification for SSP Account`,
          html: `
                  <html>
                    <body>
                      <p>Thank you for signing up for the Student Scheduler Planner (SSP).</p>
                      <p>Please <a href=${constants.URL.DOMAIN}/user/verify/${userData.email}>click me</a> to verify your email.</p>
                      <p>Use code the following code to complete your verification: <span style="color:red">${code}</span></p>
                      <p>Once your account has been verified and approved, you will be able to login.</p>
                    </body>
                  </html>`,
        },
        recipients: [{ address: userData.email }],
      })
      .then((data) => {
        resolve(constants.STATUS.SUCCESS);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

/**
 * sendUpdateEmail - Sends the code using the email field in the userData object.
 * @param {object} userData
 * @param {number} code
 * @returns {Promise}
 */
export async function sendApprovalUpdateEmail(email, approved) {
  return new Promise((resolve, reject) => {
    clientSparkpost.transmissions
      .send({
        content: {
          from: "verification@sparkpost.studying.solutions",
          subject: `SSP Email Account Approval Status Notification`,
          html: approved
            ? `
                  <html>
                    <body>
                      <p>Thank you for signing up for the Student Scheduler Planner (SSP).</p>
                      <p>Your Account has been approved. If you are verified as well, you may now login at the link below.</p>
                      <a href=${constants.URL.DOMAIN}/user/login>Login Here</a>
                    </body>
                  </html>`
            : `
                  <html>
                    <body>
                      <p>Thank you for signing up for the Student Scheduler Planner (SSP).</p>
                      <p>Your Account has been rejected. Thank you for your consideration. </p>
                    </body>
                  </html>`,
        },
        recipients: [{ address: email }],
      })
      .then((data) => {
        resolve(constants.STATUS.SUCCESS);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

/**
 * generateCode - Returns a number that is 6 digits long and does not start with 0
 * @returns {number} Random number that is not 0 and is 6 digits log
 */
export function generateCode() {
  return Math.floor(100000 + Math.random() * 900000);
}

/**
 * getUnapprovedUsers - Returns all
 * @returns {Array<unapprovedUser>} Array of Objects, where each is a user account of the Interface unapprovedUser
 */
export async function getUnapprovedUsers() {
  return new Promise((resolve, reject) => {
    let helper = clientFauna.paginate(
      query.Match(query.Index("users_unapproved"), false, false)
    );
    const response = [];
    helper
      .map((ref) => {
        return query.Get(ref);
      })
      .each((page) => {
        if (page.length > 0) {
          for (let i = 0; i < page.length; i++) {
            response.push(page[i].data);
          }
        } else {
          reject(constants.USER_ERRORS.NO_UNAPPROVED_USERS);
        }
      })
      .then(() => {
        resolve(response);
      })
      .catch((error) => reject(error.description));
  });
}
