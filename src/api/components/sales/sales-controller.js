const salesService = require('./sales-service');
const productsService = require('./../products/products-service');
const usersService = require('./../users/users-service');
const { errorResponder, errorTypes } = require('../../../core/errors');

/**
 * Handle get list of sales request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getSales(request, response, next) {
  try {
    const sales = await salesService.getSales(request.query);
    return response.status(200).json(sales);
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle get sale detail request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getSale(request, response, next) {
  try {
    const sale = await salesService.getSale(request.params.id);

    if (!sale) {
      throw errorResponder(errorTypes.UNPROCESSABLE_ENTITY, 'Unknown sale');
    }

    return response.status(200).json(sale);
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle create sale request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function createSale(request, response, next) {
  try {
    const { product, user, quantity, address } = request.body;

    const product_data = await productsService.getProduct(product);
    if (!product_data) {
      throw errorResponder(errorTypes.UNPROCESSABLE_ENTITY, 'Unknown product');
    }

    const user_data = await usersService.getUser(user);
    if (!user_data) {
      throw errorResponder(errorTypes.UNPROCESSABLE_ENTITY, 'Unknown user');
    }

    if (product_data.stock < quantity) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Not enough stock (' + product_data.stock + ' remaining)'
      );
    }

    const success = await salesService.createSale(
      product,
      user,
      quantity,
      address
    );
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to create sale'
      );
    }

    var remaining_stock = product_data.stock - quantity;

    const changeStockSuccess = await productsService.updateStock(
      product_data.id,
      remaining_stock
    );

    if (!changeStockSuccess) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to update stock'
      );
    }

    return response.status(200).json({ product, user, quantity, address });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle update sale request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function updateSale(request, response, next) {
  try {
    const id = request.params.id;

    const { product, user, quantity, address } = request.body;

    const product_data = await productsService.getProduct(product);
    if (!product_data) {
      throw errorResponder(errorTypes.UNPROCESSABLE_ENTITY, 'Unknown product');
    }

    const user_data = await usersService.getUser(user);
    if (!user_data) {
      throw errorResponder(errorTypes.UNPROCESSABLE_ENTITY, 'Unknown user');
    }

    const success = await salesService.updateSale(
      id,
      product,
      user,
      quantity,
      address
    );
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to update sale'
      );
    }

    return response.status(200).json({ id });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle delete sale request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function deleteSale(request, response, next) {
  try {
    const id = request.params.id;

    const success = await salesService.deleteSale(id);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to delete sale'
      );
    }

    return response.status(200).json({ id });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle update delivery status
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function updateDeliveryStatus(request, response, next) {
  try {
    const delivery_status = request.body.delivery_status;

    if (
      delivery_status != 'Placed' &&
      delivery_status != 'Packed' &&
      delivery_status != 'Shipped' &&
      delivery_status != 'Delivered'
    ) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Incorrect Delivery Status. Delivery status should be Placed, Packed, Shipped, or Delivered'
      );
    }

    const changeSuccess = await salesService.updateDeliveryStatus(
      request.params.id,
      delivery_status
    );

    if (!changeSuccess) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to update delivery status'
      );
    }

    return response.status(200).json({ id: request.params.id });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle get list of user's sales request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getUserSales(request, response, next) {
  try {
    const sales = await salesService.getUserSales(
      request.params.id,
      request.query
    );
    return response.status(200).json(sales);
  } catch (error) {
    return next(error);
  }
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
