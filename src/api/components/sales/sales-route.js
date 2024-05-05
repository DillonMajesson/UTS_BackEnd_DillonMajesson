const express = require('express');

const authenticationMiddleware = require('../../middlewares/authentication-middleware');
const celebrate = require('../../../core/celebrate-wrappers');
const salesController = require('./sales-controller');
const salesValidator = require('./sales-validator');

const route = express.Router();

module.exports = (app) => {
  app.use('/sales', route);

  // Get list of sales
  route.get('/', authenticationMiddleware, salesController.getSales);

  // Create sale
  route.post(
    '/',
    authenticationMiddleware,
    celebrate(salesValidator.createSale),
    salesController.createSale
  );

  // Get sale detail
  route.get('/:id', authenticationMiddleware, salesController.getSale);

  // Update sale
  route.put(
    '/:id',
    authenticationMiddleware,
    celebrate(salesValidator.updateSale),
    salesController.updateSale
  );

  // Delete sale
  route.delete('/:id', authenticationMiddleware, salesController.deleteSale);

  // Update delivery status
  route.put(
    '/:id/delivery_status',
    authenticationMiddleware,
    celebrate(salesValidator.updateDeliveryStatus),
    salesController.updateDeliveryStatus
  );

  // Get user's sales
  route.get(
    '/users/:id',
    authenticationMiddleware,
    salesController.getUserSales
  );
};
