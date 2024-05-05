const { errorResponder, errorTypes } = require('../../../core/errors');
const authenticationServices = require('./authentication-service');
const loginAttempts = {};

function handleLoginAttempt(userEmail) {
  const MAX_ATTEMPTS = 5;
  const ATTEMPT_WINDOW_MS = 30 * 60 * 1000;
  const now = Date.now();

  if (!loginAttempts[userEmail]) {
    loginAttempts[userEmail] = { count: 1, firstAttemptTime: now };
  } else {
    const { count, firstAttemptTime } = loginAttempts[userEmail];
    if (now - firstAttemptTime > ATTEMPT_WINDOW_MS) {
      loginAttempts[userEmail] = { count: 1, firstAttemptTime: now };
    } else {
      loginAttempts[userEmail].count++;
    }
    if (loginAttempts[userEmail].count > MAX_ATTEMPTS) {
      throw new Error('Too many failed login attempts.');
    }
  }
}

function resetLoginAttempts(userEmail) {
  if (loginAttempts[userEmail]) {
    delete loginAttempts[userEmail];
  }
}
/**
 * Handle login request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function login(request, response, next) {
  const { email, password } = request.body;

  try {
    handleLoginAttempt(email);
    const loginSuccess = await authenticationServices.checkLoginCredentials(email, password);

    if (!loginSuccess) {
      throw errorResponder(
        errorTypes.INVALID_CREDENTIALS,
        'Wrong email or password'
      );
    }
    resetLoginAttempts(email);
    return response.status(200).json({ message: 'Login successful' });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  login,
};
