const vouchersRepository = require('./vouchers-repository');
const { Voucher } = require('../../../models');

async function getVouchers({ pageNumber = 1, pageSize = 10, sort = 'name:asc', search = '' }) {
  const [sortBy, sortOrder] = sort.split(':');
  const validSortFields = ['name', 'code'];
  const orderBy = validSortFields.includes(sortBy) ? sortBy : 'name';
  const orderDirection = sortOrder === 'desc' ? -1 : 1;
  const [searchField, searchKey] = search.split(':');
  const validSearchFields = ['name', 'code'];
  const searchQuery = {};
  if (searchField && validSearchFields.includes(searchField) && searchKey) {
    searchQuery[searchField] = { $regex: new RegExp(searchKey, 'i') };
  }
  
  const skip = (pageNumber - 1) * pageSize;
  const vouchers = await Voucher.find(searchQuery)
    .sort({ [orderBy]: orderDirection })
    .skip(skip)
    .limit(pageSize);
  const totalCount = await Voucher.countDocuments(searchQuery);
  const total_pages = Math.ceil(totalCount / pageSize);
  const has_previous_page = pageNumber > 1;
  const has_next_page = pageNumber < total_pages;

  return {
    page_number: pageNumber,
    page_size: pageSize,
    count: vouchers.length,
    total_pages,
    has_previous_page,
    has_next_page,
    data: vouchers.map(Voucher => ({
      id: Voucher._id,
      name: Voucher.name,
      email: Voucher.email,
    })),
  };
}

async function getVoucher(id) {
  const Voucher = await vouchersRepository.getVoucher(id);

  // Voucher not found
  if (!Voucher) {
    return null;
  }

  return {
    id: Voucher.id,
    name: Voucher.name,
    email: Voucher.email,
  };
}

async function createVoucher(name, code) {
  try {
    await vouchersRepository.createVoucher(name, code);
  } catch (err) {
    return null;
  }

  return true;
}


async function updateVoucher(id, name, code) {
  const Voucher = await vouchersRepository.getVoucher(id);

  // Voucher not found
  if (!Voucher) {
    return null;
  }

  try {
    await vouchersRepository.updateVoucher(id, name, code);
  } catch (err) {
    return null;
  }

  return true;
}

async function deleteVoucher(id) {
  const Voucher = await vouchersRepository.getVoucher(id);

  // Voucher not found
  if (!Voucher) {
    return null;
  }

  try {
    await vouchersRepository.deleteVoucher(id);
  } catch (err) {
    return null;
  }

  return true;
}

module.exports = {
  getVouchers,
  getVoucher,
  createVoucher,
  updateVoucher,
  deleteVoucher,
};
