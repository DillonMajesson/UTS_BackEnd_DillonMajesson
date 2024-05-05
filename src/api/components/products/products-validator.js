const joi = require('joi');
const { joiPasswordExtendCore } = require('joi-password');

module.exports = {
  createProduct: {
    body: {
      name: joi.string().min(1).max(100).required().label('Name'),
      price: joi.number().required().label('Price'),
      description: joi.string().min(1).required().label('Description'),
      category: joi.string().min(1).max(100).required().label('Category'),
      stock: joi.number().required().label('Stock'),
    },
  },

  updateProduct: {
    body: {
      name: joi.string().min(1).max(100).required().label('Name'),
      price: joi.number().required().label('Price'),
      description: joi.string().min(1).required().label('Description'),
      category: joi.string().min(1).max(100).required().label('Category'),
    },
  },

  updateStock: {
    body: {
      stock: joi.number().required().label('Stock'),
    },
  },
};
