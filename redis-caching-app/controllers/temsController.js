const redisClient = require('../utils/redisClient');
const items = require('../data/itemsData');

const CACHE_KEY = 'items:all';

// GET all items
exports.getItems = async (req, res) => {
  try {
    const cachedData = await redisClient.get(CACHE_KEY);
    if (cachedData) {
      console.log('Cache hit for /items');
      return res.json(JSON.parse(cachedData));
    }

    console.log('Cache miss for /items, fetching from DB');
    // Cache with 60 sec TTL
    await redisClient.set(CACHE_KEY, JSON.stringify(items), { EX: 60 });

    return res.json(items);
  } catch (err) {
    console.error('Error in getItems:', err);
    res.status(500).send('Server error');
  }
};

// POST add new item
exports.addItem = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Name is required' });

    const newItem = { id: items.length ? items[items.length - 1].id + 1 : 1, name };
    items.push(newItem);

    // Invalidate cache
    await redisClient.del(CACHE_KEY);
    console.log('Cache invalidated after POST /items');

    res.status(201).json(newItem);
  } catch (err) {
    console.error('Error in addItem:', err);
    res.status(500).send('Server error');
  }
};

// PUT update item by id
exports.updateItem = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name } = req.body;

    const index = items.findIndex(i => i.id === id);
    if (index === -1) return res.status(404).json({ message: 'Item not found' });
    if (!name) return res.status(400).json({ message: 'Name is required' });

    items[index].name = name;

    // Invalidate cache
    await redisClient.del(CACHE_KEY);
    console.log('Cache invalidated after PUT /items/:id');

    res.json(items[index]);
  } catch (err) {
    console.error('Error in updateItem:', err);
    res.status(500).send('Server error');
  }
};

// DELETE item by id
exports.deleteItem = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const index = items.findIndex(i => i.id === id);
    if (index === -1) return res.status(404).json({ message: 'Item not found' });

    items.splice(index, 1);

    // Invalidate cache
    await redisClient.del(CACHE_KEY);
    console.log('Cache invalidated after DELETE /items/:id');

    res.json({ message: 'Item deleted' });
  } catch (err) {
    console.error('Error in deleteItem:', err);
    res.status(500).send('Server error');
  }
};
