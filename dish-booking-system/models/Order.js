const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  dish: { type: mongoose.Schema.Types.ObjectId, ref: 'Dish', required: true },
  chef: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { 
    type: String, 
    enum: ['Order Received', 'Preparing', 'Out for Delivery', 'Delivered'], 
    default: 'Order Received' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
