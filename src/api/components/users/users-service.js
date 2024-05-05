const usersRepository = require('./users-repository');
const { hashPassword, passwordMatched } = require('../../../utils/password');
const { User } = require('../../../models');

/**
 * Get list of users
 * @returns {Array}
 */
async function getUsers({ pageNumber = 1, pageSize = 10, sort = 'email:asc', search = '' }) {
  const [sortBy, sortOrder] = sort.split(':');
  const validSortFields = ['email', 'name'];
  const orderBy = validSortFields.includes(sortBy) ? sortBy : 'email';
  const orderDirection = sortOrder === 'desc' ? -1 : 1;
  const [searchField, searchKey] = search.split(':');
  const validSearchFields = ['email', 'name'];
  const searchQuery = {};
  if (searchField && validSearchFields.includes(searchField) && searchKey) {
    searchQuery[searchField] = { $regex: new RegExp(searchKey, 'i') };
  }
  const totalCount = await User.countDocuments(searchQuery);
  const actualPageSize = Math.max(1, Math.min(pageSize, totalCount));
  const skip = (pageNumber - 1) * actualPageSize;

  const users = await User.find(searchQuery)
    .sort({ [orderBy]: orderDirection })
    .skip(skip)
    .limit(actualPageSize);

  const total_pages = Math.ceil(totalCount / actualPageSize);
  const has_previous_page = pageNumber > 1;
  const has_next_page = pageNumber < total_pages;

  return {
    page_number: pageNumber,
    page_size: actualPageSize,
    count: users.length,
    total_pages,
    has_previous_page,
    has_next_page,
    data: users.map(user => ({
      id: user._id,
      name: user.name,
      email: user.email,
    })),
  };
}


/**
 * Get user detail
 * @param {string} id - User ID
 * @returns {Object}
 */
async function getUser(id) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

/**
 * Create new user
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Password
 * @returns {boolean}
 */
async function createUser(name, email, password) {
  // Hash password
  const hashedPassword = await hashPassword(password);

  try {
    await usersRepository.createUser(name, email, hashedPassword);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Update existing user
 * @param {string} id - User ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {boolean}
 */
async function updateUser(id, name, email) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  try {
    await usersRepository.updateUser(id, name, email);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Delete user
 * @param {string} id - User ID
 * @returns {boolean}
 */
async function deleteUser(id) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  try {
    await usersRepository.deleteUser(id);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Check whether the email is registered
 * @param {string} email - Email
 * @returns {boolean}
 */
async function emailIsRegistered(email) {
  const user = await usersRepository.getUserByEmail(email);

  if (user) {
    return true;
  }

  return false;
}

/**
 * Check whether the password is correct
 * @param {string} userId - User ID
 * @param {string} password - Password
 * @returns {boolean}
 */
async function checkPassword(userId, password) {
  const user = await usersRepository.getUser(userId);
  return passwordMatched(password, user.password);
}

/**
 * Change user password
 * @param {string} userId - User ID
 * @param {string} password - Password
 * @returns {boolean}
 */
async function changePassword(userId, password) {
  const user = await usersRepository.getUser(userId);

  // Check if user not found
  if (!user) {
    return null;
  }

  const hashedPassword = await hashPassword(password);

  const changeSuccess = await usersRepository.changePassword(
    userId,
    hashedPassword
  );

  if (!changeSuccess) {
    return null;
  }

  return true;
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  emailIsRegistered,
  checkPassword,
  changePassword,
};
