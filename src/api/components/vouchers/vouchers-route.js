const express = require('express');

const authenticationMiddleware = require('../../middlewares/authentication-middleware');
const celebrate = require('../../../core/celebrate-wrappers');
const vouchersControllers = require('./vouchers-controller');
const vouchersValidator = require('./vouchers-validator');

const route = express.Router();

module.exports = (app) => {
  app.use('/vouchers', route);

  route.get('/', authenticationMiddleware, vouchersControllers.getVouchers);


  route.post(
    '/',
    authenticationMiddleware,
    celebrate(vouchersValidator.createVoucher),
    vouchersControllers.createVoucher
  );

  route.get('/:id', authenticationMiddleware, vouchersControllers.getVoucher);

  route.put(
    '/:id',
    authenticationMiddleware,
    celebrate(vouchersValidator.updateVoucher),
    vouchersControllers.updateVoucher
  );

  route.delete('/:id', authenticationMiddleware, vouchersControllers.deleteVoucher);

};
