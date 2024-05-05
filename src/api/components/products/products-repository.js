const { Product } = require('../../../models');

/**
 * Get a list of products
 * @returns {Promise}
 */
async function getProducts(query) {
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
      if (searchType != 'price') {
        const regex = new RegExp(searchValue, 'i');
        search = {
          [searchType]: {
            $regex: regex,
          },
        };
      } else {
        search = {
          [searchType]: searchValue,
        };
      }
    }
  }

  const skip = (query.page_number - 1) * query.page_size;

  const products = Product.find(search)
    .sort(sort)
    .limit(query.page_size)
    .skip(skip);
  return products;
}

/**
 * Get total of products
 * @returns {Promise}
 */
async function getProductsTotal(query) {
  let search = {};
  if (query.search) {
    const [searchType, searchValue] = query.search.split(':');

    if (searchValue) {
      if (searchType != 'price') {
        const regex = new RegExp(searchValue, 'i');
        search = {
          [searchType]: {
            $regex: regex,
          },
        };
      } else {
        search = {
          [searchType]: searchValue,
        };
      }
    }
  }
  const total = Product.countDocuments(search);
  return total;
}

/**
 * Get product detail
 * @param {string} id - Product ID
 * @returns {Promise}
 */
async function getProduct(id) {
  return Product.findById(id);
}

/**
 * Create new product
 * @param {string} name - Name
 * @param {Number} price - Price
 * @param {string} description - Description
 * @param {string} category - Category
 * @param {Number} stock - Stock
 * @returns {Promise}
 */
async function createProduct(name, price, description, category, stock) {
  return Product.create({
    name,
    price,
    description,
    category,
    stock,
  });
}

/**
 * Update existing product
 * @param {string} id - Product ID
 * @param {string} name - Name
 * @param {Number} price - Price
 * @param {string} description - Description
 * @param {string} category - Category
 * @param {Number} stock - Stock
 * @returns {Promise}
 */
async function updateProduct(id, name, price, description, category, stock) {
  return Product.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        name,
        price,
        description,
        category,
        stock,
      },
    }
  );
}

/**
 * Delete a product
 * @param {string} id - Product ID
 * @returns {Promise}
 */
async function deleteProduct(id) {
  return Product.deleteOne({ _id: id });
}

/**
 * Update product stock
 * @param {string} id - Product ID
 * @param {Number} stock - New hashed password
 * @returns {Promise}
 */
async function updateStock(id, stock) {
  return Product.updateOne({ _id: id }, { $set: { stock } });
}

/**
 * Get product by name to prevent duplicate name
 * @param {string} name - Name
 * @returns {Promise}
 */
async function getProductByName(name, id) {
  let filter = { name };

  if (id) {
    filter['_id'] = { $ne: id };
  }

  return Product.findOne(filter);
}

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsTotal,
  updateStock,
  getProductByName,
};
