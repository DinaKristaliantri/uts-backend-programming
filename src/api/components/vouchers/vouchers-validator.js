const joi = require('joi');

module.exports = {
  createVoucher: {
    body: {
      name: joi.string().min(1).max(100).required().label('Name'),
      code: joi.string().min(1).max(100).required().label('Code'),
    },
  },

  updateVoucher: {
    body: {
      name: joi.string().min(1).max(100).required().label('Name'),
      code: joi.string().min(1).max(100).required().label('Code'),
    },
  },
};
