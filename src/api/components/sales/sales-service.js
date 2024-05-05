const salesRepository = require('./sales-repository');

/**
 * Get list of sales
 * @returns {Array}
 */
async function getSales(query) {
  let page_number = query.page_number ? parseInt(query.page_number) : 1;
  let page_size = query.page_size ? parseInt(query.page_size) : 10;
  let total_pages = 1;
  let has_previous_page = false;
  let has_next_page = false;

  const sales = await salesRepository.getSales({
    page_number,
    page_size,
    sort: query.sort,
    search: query.search,
  });

  const results = [];
  for (let i = 0; i < sales.length; i += 1) {
    const sale = sales[i];
    results.push({
      id: sale.id,
      date: sale.date,
      quantity: sale.quantity,
      address: sale.address,
      delivery_status: sale.delivery_status,
      product: sale.product,
      user: sale.user,
    });
  }

  const totalCount = await salesRepository.getSalesTotal({
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
 * Get sales detail
 * @param {string} id - Sales ID
 * @returns {Object}
 */
async function getSale(id) {
  const sale = await salesRepository.getSale(id);

  // Sale not found
  if (!sale) {
    return null;
  }

  return {
    id: sale.id,
    date: sale.date,
    product: sale.product,
    user: sale.user,
    quantity: sale.quantity,
    address: sale.address,
    delivery_status: sale.delivery_status,
  };
}

/**
 * Create new sale
 * @param {string} product - Product ID
 * @param {string} user - User ID
 * @param {Number} quantity - Quantity
 * @param {string} address - Address
 * @returns {boolean}
 */
async function createSale(product, user, quantity, address) {
  try {
    await salesRepository.createSale(product, user, quantity, address);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Update existing sale
 * @param {string} id - Sale ID
 * @param {string} product - Product ID
 * @param {string} user - User ID
 * @param {Number} quantity - Quantity
 * @param {string} address - Address
 * @returns {boolean}
 */
async function updateSale(id, product, user, quantity, address) {
  const sale = await salesRepository.getSale(id);

  // Sale not found
  if (!sale) {
    return null;
  }

  try {
    await salesRepository.updateSale(id, product, user, quantity, address);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Delete sale
 * @param {string} id - Sale ID
 * @returns {boolean}
 */
async function deleteSale(id) {
  const sale = await salesRepository.getSale(id);

  // Sales not found
  if (!sale) {
    return null;
  }

  try {
    await salesRepository.deleteSale(id);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Update delivery status
 * @param {string} productId - Sale ID
 * @param {string} delivery_status - Delivery Status
 * @returns {boolean}
 */
async function updateDeliveryStatus(saleId, delivery_status) {
  const sale = await salesRepository.getSale(saleId);

  // Check if sale not found
  if (!sale) {
    return null;
  }

  const changeSuccess = await salesRepository.updateDeliveryStatus(
    saleId,
    delivery_status
  );

  if (!changeSuccess) {
    return null;
  }

  return true;
}

/**
 * Get list of sales
 * @returns {Array}
 */
async function getUserSales(user_id, query) {
  let page_number = query.page_number ? parseInt(query.page_number) : 1;
  let page_size = query.page_size ? parseInt(query.page_size) : 10;
  let total_pages = 1;
  let has_previous_page = false;
  let has_next_page = false;

  const sales = await salesRepository.getUserSales(user_id, {
    page_number,
    page_size,
    sort: query.sort,
    search: query.search,
  });

  const results = [];
  for (let i = 0; i < sales.length; i += 1) {
    const sale = sales[i];
    results.push({
      id: sale.id,
      date: sale.date,
      quantity: sale.quantity,
      address: sale.address,
      delivery_status: sale.delivery_status,
      product: sale.product,
      user: sale.user,
    });
  }

  const totalCount = await salesRepository.getUserSalesTotal(user_id, {
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

module.exports = {
  getSales,
  getSale,
  createSale,
  updateSale,
  deleteSale,
  updateDeliveryStatus,
  getUserSales,
};
