// Import the events module
const EventEmitter = require('events');

// Create an instance of EventEmitter
const emitter = new EventEmitter();

// --- Event Listeners ---

// Listener for userLoggedIn
emitter.on('userLoggedIn', (username) => {
  console.log(`> User ${username} logged in`);
});

emitter.on('userLoggedIn', (username) => {
  console.log(`> Notification sent to ${username}`);
});

// Listener for messageReceived
emitter.on('messageReceived', (username, message) => {
  console.log(`> New message for ${username}: "${message}"`);
});

// Listener for dataSynced
emitter.on('dataSynced', (username) => {
  console.log(`> Data sync complete for ${username}`);
});

emitter.on('dataSynced', (username) => {
  console.log(`> Logging sync completion for ${username}`);
});

// --- Simulated Real-Time Flow ---

// Simulate user login after 1 second
setTimeout(() => {
  const user = 'John';
  emitter.emit('userLoggedIn', user);

  // Simulate message received after 2 seconds
  setTimeout(() => {
    emitter.emit('messageReceived', user, 'Welcome to the system!');

    // Simulate data sync
    console.log('> Syncing user data...');
    setTimeout(() => {
      emitter.emit('dataSynced', user);
    }, 1500);

  }, 2000);

}, 1000);
