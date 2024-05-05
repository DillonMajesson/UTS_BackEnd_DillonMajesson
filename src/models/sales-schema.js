const mongoose = require('mongoose');

const salesSchema = {
  date: Date,
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'products',
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
  },
  quantity: Number,
  address: String,
  delivery_status: String, //Placed, Packed, Shipped, Delivered
};

module.exports = salesSchema;
