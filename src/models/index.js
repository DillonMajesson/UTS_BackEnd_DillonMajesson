const mongoose = require('mongoose');
const config = require('../core/config');
const logger = require('../core/logger')('app');

const usersSchema = require('./users-schema');
const productsSchema = require('./products-schema');
const salesSchema = require('./sales-schema');

mongoose.connect(`${config.database.connection}/${config.database.name}`, {
  useNewUrlParser: true,
});

const db = mongoose.connection;
db.once('open', () => {
  logger.info('Successfully connected to MongoDB');
});

const User = mongoose.model('users', mongoose.Schema(usersSchema));
const Product = mongoose.model('products', mongoose.Schema(productsSchema));
const Sale = mongoose.model('sales', mongoose.Schema(salesSchema));

module.exports = {
  mongoose,
  User,
  Product,
  Sale,
};
