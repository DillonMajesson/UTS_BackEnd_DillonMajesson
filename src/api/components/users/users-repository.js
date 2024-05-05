const { User } = require('../../../models');

/**
 * Get a list of users
 * @returns {Promise}
 */
async function getUsers(query) {
  let sort = {};
  if (query.sort) {
    const [sortType, sortOrder] = query.sort.split(':');
    sort = {
      [sortType]: sortOrder == 'desc' ? -1 : 0,
    };
  }

  let search = {};
  if (query.search) {
    const [searchType, searchValue] = query.search.split(':');

    if (searchValue) {
      const regex = new RegExp(searchValue, 'i');
      search = {
        [searchType]: {
          $regex: regex,
        },
      };
    }
  }

  const skip = (query.page_number - 1) * query.page_size;

  const users = User.find(search).sort(sort).limit(query.page_size).skip(skip);
  return users;
}

/**
 * Get total of users
 * @returns {Promise}
 */
async function getUsersTotal(query) {
  let search = {};
  if (query.search) {
    const [searchType, searchValue] = query.search.split(':');

    const regex = new RegExp(searchValue, 'i');
    search = {
      [searchType]: {
        $regex: regex,
      },
    };
  }
  const numUsers = User.countDocuments(search);
  return numUsers;
}

/**
 * Get user detail
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function getUser(id) {
  return User.findById(id);
}

/**
 * Create new user
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Hashed password
 * @returns {Promise}
 */
async function createUser(name, email, password) {
  return User.create({
    name,
    email,
    password,
  });
}

/**
 * Update existing user
 * @param {string} id - User ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {Promise}
 */
async function updateUser(id, name, email) {
  return User.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        name,
        email,
      },
    }
  );
}

/**
 * Delete a user
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function deleteUser(id) {
  return User.deleteOne({ _id: id });
}

/**
 * Get user by email to prevent duplicate email
 * @param {string} email - Email
 * @returns {Promise}
 */
async function getUserByEmail(email, id) {
  let filter = { email };

  if (id) {
    filter['_id'] = { $ne: id };
  }

  return User.findOne(filter);
}

/**
 * Update user password
 * @param {string} id - User ID
 * @param {string} password - New hashed password
 * @returns {Promise}
 */
async function changePassword(id, password) {
  return User.updateOne({ _id: id }, { $set: { password } });
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getUserByEmail,
  changePassword,
  getUsersTotal,
};
