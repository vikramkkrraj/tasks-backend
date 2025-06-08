const express = require('express');
const app = express();
const itemsRoutes = require('./routes/itemsRoutes');

app.use(express.json());

// Use the items routes
app.use('/', itemsRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
