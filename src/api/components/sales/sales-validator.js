const joi = require('joi');

module.exports = {
  createSale: {
    body: {
      product: joi.string().min(1).max(100).required().label('Product'),
      user: joi.string().min(1).max(100).required().label('User'),
      quantity: joi.number().min(1).required().label('Quantity'),
      address: joi.string().min(1).max(100).required().label('Address'),
    },
  },

  updateSale: {
    body: {
      product: joi.string().min(1).max(100).required().label('Product'),
      user: joi.string().min(1).max(100).required().label('User'),
      quantity: joi.number().min(1).required().label('Quantity'),
      address: joi.string().min(1).max(100).required().label('Address'),
    },
  },
  updateDeliveryStatus: {
    body: {
      delivery_status: joi
        .string()
        .min(1)
        .max(100)
        .required()
        .label('Delivery Status'),
    },
  },
};
