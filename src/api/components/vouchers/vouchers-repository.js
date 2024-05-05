const { Voucher } = require('../../../models');

async function getVouchers() {
  return Voucher.find({});
}

async function getVoucher(id) {
  return Voucher.findById(id);
}


async function createVoucher(name, code) {
  return Voucher.create({
    name,
    code
  });
}

async function updateVoucher(id, name, code) {
  return Voucher.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        name,
        code,
      },
    }
  );
}

async function deleteVoucher(id) {
  return Voucher.deleteOne({ _id: id });
}

module.exports = {
  getVouchers,
  getVoucher,
  createVoucher,
  updateVoucher,
  deleteVoucher,
};
