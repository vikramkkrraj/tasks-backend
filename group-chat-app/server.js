const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { redisClient } = require('./db/redisClient');
const { saveToMongo } = require('./db/mongoClient');
const cron = require('node-cron');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const users = new Map();
let messages = [];

app.use(express.static('public'));

// Backup to MongoDB every 5 minutes
cron.schedule('*/5 * * * *', async () => {
  if (messages.length > 0) {
    await saveToMongo(messages);
    messages = [];
  }
});

io.on('connection', (socket) => {
  let username = null;

  socket.on('register', async (name) => {
    username = name;
    users.set(socket.id, name);
    io.emit('onlineUsers', Array.from(users.values()));

    // Load and emit chat history
    const redisHistory = await redisClient.lRange('chat_history', 0, 20);
    redisHistory.reverse().forEach(json => {
      socket.emit('chatMessage', JSON.parse(json));
    });

    socket.broadcast.emit('chatMessage', { user: 'System', text: `${name} joined.` });
  });

  socket.on('chatMessage', async (text) => {
    const msg = { user: username, text, time: new Date().toISOString() };
    messages.push(msg);
    await redisClient.lPush('chat_history', JSON.stringify(msg));
    io.emit('chatMessage', msg);
  });

  socket.on('adminMessage', (text) => {
    if (username.toLowerCase() === 'admin') {
      const msg = { user: 'Admin', text, time: new Date().toISOString() };
      messages.push(msg);
      io.emit('adminMessage', msg);
    }
  });

  socket.on('disconnect', () => {
    users.delete(socket.id);
    io.emit('onlineUsers', Array.from(users.values()));
    io.emit('chatMessage', { user: 'System', text: `${username} left.` });
  });
});

server.listen(3000, () => console.log('🚀 Server running on http://localhost:3000'));
