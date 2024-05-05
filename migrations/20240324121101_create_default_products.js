const logger = require('../src/core/logger')('api');
const { Product } = require('../src/models');
const { sample_products } = require('./sample_product');

logger.info('Creating default products');

(async () => {
  try {
    const numProducts = await Product.countDocuments();

    if (numProducts > 0) {
      throw new Error(`Products created`);
    }

    await Product.insertMany(sample_products);
  } catch (e) {
    logger.error(e);
  } finally {
    process.exit(0);
  }
})();
