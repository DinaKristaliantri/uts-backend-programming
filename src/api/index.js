const express = require('express');

const authentication = require('./components/authentication/authentication-route');
const users = require('./components/users/users-route');
const vouchers = require('./components/vouchers/vouchers-route');

module.exports = () => {
  const app = express.Router();

  authentication(app);
  users(app);
  vouchers(app);

  return app;
};
