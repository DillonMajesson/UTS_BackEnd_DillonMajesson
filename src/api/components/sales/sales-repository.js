const moment = require('moment');
const { Sale } = require('../../../models');

/**
 * Get a list of sales
 * @returns {Promise}
 */
async function getSales(query) {
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
      if (searchType == 'date') {
        search['date'] = {
          $gte: moment(searchValue).startOf('day').format(),
          $lte: moment(searchValue).endOf('day').format(),
        };
      } else if (searchType == 'delivery_status') {
        search['delivery_status'] = searchValue;
      } else {
        const regex = new RegExp(searchValue, 'i');
        search = {
          [searchType]: {
            $regex: regex,
          },
        };
      }
    }
  }

  const skip = (query.page_number - 1) * query.page_size;

  const sales = Sale.find(search)
    .populate('user')
    .populate('product')
    .sort(sort)
    .limit(query.page_size)
    .skip(skip);
  return sales;
}

/**
 * Get total of sales
 * @returns {Promise}
 */
async function getSalesTotal(query) {
  let search = {};
  if (query.search) {
    const [searchType, searchValue] = query.search.split(':');

    if (searchValue) {
      if (searchType == 'date') {
        search['date'] = {
          $gte: moment(searchValue).startOf('day').format(),
          $lte: moment(searchValue).endOf('day').format(),
        };
      } else if (searchType == 'delivery_status') {
        search['delivery_status'] = searchValue;
      } else {
        const regex = new RegExp(searchValue, 'i');
        search = {
          [searchType]: {
            $regex: regex,
          },
        };
      }
    }
  }
  const total = Sale.countDocuments(search);
  return total;
}

/**
 * Get sale detail
 * @param {string} id - Sale ID
 * @returns {Promise}
 */
async function getSale(id) {
  return Sale.findById(id);
}

/**
 * Create new sale
 * @param {string} product - Price
 * @param {string} user - Description
 * @param {Number} quantity - Stock
 * @param {string} address - Address
 * @returns {Promise}
 */
async function createSale(product, user, quantity, address) {
  return Sale.create({
    product,
    user,
    quantity,
    address,
    date: new Date(),
    delivery_status: 'Placed',
  });
}

/**
 * Update existing sale
 * @param {string} id - Sale ID
 * @param {string} product - Product ID
 * @param {string} user - User ID
 * @param {Number} quantity - Quantity
 * @param {string} address - Address
 * @returns {Promise}
 */
async function updateSale(id, product, user, quantity, address) {
  return Sale.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        product,
        user,
        quantity,
        address,
      },
    }
  );
}

/**
 * Delete a sale
 * @param {string} id - Sale ID
 * @returns {Promise}
 */
async function deleteSale(id) {
  return Sale.deleteOne({ _id: id });
}

/**
 * Update delivery status
 * @param {string} id - Sale ID
 * @param {string} delivery_status - Delivery Status (Placed, Packed, Shipped, Delivered)
 * @returns {Promise}
 */
async function updateDeliveryStatus(id, delivery_status) {
  return Sale.updateOne({ _id: id }, { $set: { delivery_status } });
}

/**
 * Get a list of user's sales
 * @returns {Promise}
 */
async function getUserSales(user_id, query) {
  let sort = {};
  if (query.sort) {
    const [sortType, sortOrder] = query.sort.split(':');
    sort = {
      [sortType]: sortOrder == 'desc' ? -1 : 0,
    };
  }

  let search = { user: user_id };
  if (query.search) {
    const [searchType, searchValue] = query.search.split(':');

    if (searchValue && searchType != 'user') {
      if (searchType == 'date') {
        search['date'] = {
          $gte: moment(searchValue).startOf('day').format(),
          $lte: moment(searchValue).endOf('day').format(),
        };
      } else if (searchType == 'delivery_status') {
        search['delivery_status'] = searchValue;
      } else {
        const regex = new RegExp(searchValue, 'i');
        search = {
          [searchType]: {
            $regex: regex,
          },
        };
      }
    }
  }

  const skip = (query.page_number - 1) * query.page_size;

  const sales = Sale.find(search)
    .populate('user')
    .populate('product')
    .sort(sort)
    .limit(query.page_size)
    .skip(skip);
  return sales;
}

/**
 * Get total of user's sales
 * @returns {Promise}
 */
async function getUserSalesTotal(user_id, query) {
  let search = { user: user_id };
  if (query.search) {
    const [searchType, searchValue] = query.search.split(':');

    if (searchValue && searchType != 'user') {
      if (searchType == 'date') {
        search['date'] = {
          $gte: moment(searchValue).startOf('day').format(),
          $lte: moment(searchValue).endOf('day').format(),
        };
      } else if (searchType == 'delivery_status') {
        search['delivery_status'] = searchValue;
      } else {
        const regex = new RegExp(searchValue, 'i');
        search = {
          [searchType]: {
            $regex: regex,
          },
        };
      }
    }
  }
  const total = Sale.countDocuments(search);
  return total;
}

module.exports = {
  getSales,
  getSale,
  createSale,
  updateSale,
  deleteSale,
  getSalesTotal,
  updateDeliveryStatus,
  getUserSales,
  getUserSalesTotal,
};
