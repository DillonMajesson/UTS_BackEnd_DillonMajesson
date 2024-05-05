const { errorResponder, errorTypes } = require('../../../core/errors');
const authenticationServices = require('./authentication-service');

/**
 * Handle login request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */

const failedLoginAttempts = {};
const lastLoginAttempt = {};
const minutesToReset = 30;
const maxLoginAttempt = 5;

async function login(request, response, next) {
  const { email, password } = request.body;

  try {
    // Check if there have been too many failed login attempts for this user
    if (failedLoginAttempts[email] >= maxLoginAttempt) {
      if (
        lastLoginAttempt[email] &&
        Date.now() - lastLoginAttempt[email] < minutesToReset * 60 * 1000
      ) {
        throw errorResponder(
          errorTypes.TOO_MANY_FAILED_LOGIN_ATTEMPTS,
          'Too many failed login attempts. Please try again after 30 minutes.'
        );
      } else {
        // Reset failed login attempts if more than X minutes have passed since the last attempt
        delete failedLoginAttempts[email];
      }
    }

    // Check login credentials
    const loginSuccess = await authenticationServices.checkLoginCredentials(
      email,
      password
    );

    if (!loginSuccess) {
      failedLoginAttempts[email] = (failedLoginAttempts[email] || 0) + 1;
      lastLoginAttempt[email] = Date.now();

      throw errorResponder(
        errorTypes.INVALID_CREDENTIALS,
        'Wrong email or password'
      );
    }

    delete failedLoginAttempts[email];
    delete lastLoginAttempt[email];
    return response.status(200).json(loginSuccess);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  login,
};
