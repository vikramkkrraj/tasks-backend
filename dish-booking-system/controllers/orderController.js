const Order = require('../models/Order');
const User = require('../models/User');

// Assign a random chef from users with role 'chef'
async function assignChef() {
  const chefs = await User.find({ role: 'chef' });
  if (chefs.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * chefs.length);
  return chefs[randomIndex]._id;
}

exports.createOrder = async (req, res) => {
  try {
    const { dish } = req.body;
    if (!dish) return res.status(400).json({ message: 'Dish id is required' });

    const chefId = await assignChef();

    const order = new Order({
      user: req.user.userId,
      dish,
      chef: chefId,
      status: 'Order Received'
    });

    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create order', error: err.message });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.userId }).populate('dish chef', 'name');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get orders', error: err.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user dish chef', 'name email');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get orders', error: err.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['Order Received', 'Preparing', 'Out for Delivery', 'Delivered'];
  if (!validStatuses.includes(status)) return res.status(400).json({ message: 'Invalid status' });

  try {
    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Chef can only update their own orders
    if (req.user.role === 'chef' && order.chef.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to update this order' });
    }

    order.status = status;
    await order.save();

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update order', error: err.message });
  }
};
