const productsRepository = require('./products-repository');

/**
 * Get list of products
 * @returns {Array}
 */
async function getProducts(query) {
  let page_number = query.page_number ? parseInt(query.page_number) : 1;
  let page_size = query.page_size ? parseInt(query.page_size) : 10;
  let total_pages = 1;
  let has_previous_page = false;
  let has_next_page = false;

  const products = await productsRepository.getProducts({
    page_number,
    page_size,
    sort: query.sort,
    search: query.search,
  });

  const results = [];
  for (let i = 0; i < products.length; i += 1) {
    const product = products[i];
    results.push({
      id: product.id,
      name: product.name,
      price: product.price,
      description: product.description,
      stock: product.stock,
    });
  }

  const totalCount = await productsRepository.getProductsTotal({
    search: query.search,
  });
  total_pages = Math.ceil(totalCount / page_size);

  if (total_pages < 1) total_pages = 1;
  else if (total_pages > 1) {
    if (page_number > 1) {
      has_previous_page = true;
    }

    if (page_number < total_pages) {
      has_next_page = true;
    }
  }

  return {
    page_number,
    page_size,
    count: totalCount,
    total_pages,
    has_previous_page,
    has_next_page,
    data: results,
  };
}

/**
 * Get product detail
 * @param {string} id - Product ID
 * @returns {Object}
 */
async function getProduct(id) {
  try {
    const product = await productsRepository.getProduct(id);

    // Product not found
    if (!product) {
      return null;
    }

    return {
      id: product.id,
      name: product.name,
      price: product.price,
      description: product.description,
      stock: product.stock,
    };
  } catch (err) {
    return null;
  }
}

/**
 * Create new product
 * @param {string} name - Name
 * @param {Number} price - Price
 * @param {description} description - Description
 * @param {string} category - Product Category (Male, Female, Unisex)
 * @param {Number} stock - Stock
 * @returns {boolean}
 */
async function createProduct(name, price, description, category, stock) {
  try {
    await productsRepository.createProduct(
      name,
      price,
      description,
      category,
      stock
    );
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Update existing prodcut
 * @param {string} id - Product ID
 * @param {string} name - Name
 * @param {Number} price - Price
 * @param {description} description - Description
 * @param {string} category - Product Category (Male, Female, Unisex)
 * @param {Number} stock - Stock
 * @returns {boolean}
 */
async function updateProduct(id, name, price, description, category) {
  try {
    const product = await productsRepository.getProduct(id);

    // Product not found
    if (!product) {
      return null;
    }
    await productsRepository.updateProduct(
      id,
      name,
      price,
      description,
      category
    );
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Delete product
 * @param {string} id - product ID
 * @returns {boolean}
 */
async function deleteProduct(id) {
  try {
    const product = await productsRepository.getProduct(id);

    // Product not found
    if (!product) {
      return null;
    }
    await productsRepository.deleteProduct(id);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Change product stock
 * @param {string} productId - Product ID
 * @param {Number} stock - Password
 * @returns {boolean}
 */
async function updateStock(productId, stock) {
  try {
    const product = await productsRepository.getProduct(productId);

    // Check if product not found
    if (!product) {
      return null;
    }

    const changeSuccess = await productsRepository.updateStock(
      productId,
      stock
    );

    if (!changeSuccess) {
      return null;
    }
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Check whether the product is created with the same name
 * @param {string} name - Name
 * @returns {boolean}
 */
async function checkProductName(name, id) {
  try {
    const user = await productsRepository.getProductByName(name, id);

    if (user) {
      return true;
    }
  } catch (err) {
    return null;
  }

  return false;
}

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  updateStock,
  checkProductName,
};
