const socket = io();
let name = prompt("Enter your name to join:");

if (name) socket.emit('register', name);

socket.on('onlineUsers', (list) => {
  document.getElementById('users').innerText = "Online: " + list.join(', ');
});

socket.on('chatMessage', ({ user, text, time }) => {
  const chat = document.getElementById('chat');
  chat.innerHTML += `<p><strong>${user}</strong>: ${text} <small>${new Date(time).toLocaleTimeString()}</small></p>`;
});

socket.on('adminMessage', ({ text, time }) => {
  document.getElementById('chat').innerHTML += `<p style="color:red;"><strong>📢 Admin:</strong> ${text} <small>${new Date(time).toLocaleTimeString()}</small></p>`;
});

function sendMessage() {
  const input = document.getElementById('msg');
  const text = input.value;
  if (name.toLowerCase() === 'admin') {
    socket.emit('adminMessage', text);
  } else {
    socket.emit('chatMessage', text);
  }
  input.value = '';
}

function disconnectUser() {
  socket.disconnect();
}
