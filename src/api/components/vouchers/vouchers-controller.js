const vouchersService = require('./vouchers-service');
const { errorResponder, errorTypes } = require('../../../core/errors');
const { create } = require('lodash');

async function getVouchers(req, res, next) {
  try {
    const { page_number, page_size, sort, search } = req.query;
    const vouchersData = await vouchersService.getVouchers({
      pageNumber: parseInt(page_number) || 1,
      pageSize: parseInt(page_size) || 10,
      sort,
      search,
    });
    res.status(200).json(vouchersData);
  } catch (error) {
    next(error);
  }
}

async function getVoucher(request, response, next) {
  try {
    const voucher = await vouchersService.getVoucher(request.params.id);

    if (!voucher) {
      throw errorResponder(errorTypes.UNPROCESSABLE_ENTITY, 'Unknown voucher');
    }

    return response.status(200).json(voucher);
  } catch (error) {
    return next(error);
  }
}

async function createVoucher(request, response, next) {
  try {
    const name = request.body.name;
    const code = request.body.code;
    const success = await vouchersService.createVoucher(name, code);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to create voucher'
      );
    }

    return response.status(200).json({ name, code });
  } catch (error) {
    return next(error);
  }
}

async function updateVoucher(request, response, next) {
  try {
    const id = request.params.id;
    const name = request.body.name;
    const code = request.body.code;

    const success = await vouchersService.updateVoucher(id, name, code);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to update voucher'
      );
    }

    return response.status(200).json({ message: "Successfuly updated voucher" });
  } catch (error) {
    return next(error);
  }
}

async function deleteVoucher(request, response, next) {
  try {
    const id = request.params.id;

    const success = await vouchersService.deleteVoucher(id);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to delete voucher'
      );
    }

    return response.status(200).json({ message: "Successfuly deleted voucher" });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getVouchers,
  getVoucher,
  createVoucher,
  updateVoucher,
  deleteVoucher
};
