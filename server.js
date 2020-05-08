const fs = require('fs');
const express = require('express');
const DB_PATH = 'db.json';
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

let chat;
try {
  chat = JSON.parse(fs.readFileSync(DB_PATH));
} catch (e) {
  chat = [];
  save();
}

let chatRooms = [];
for (var i = 0; i < chat.length; i++) {
  chatRooms.push(chat[i].room)
}

function save() {
  return new Promise((resolve, reject) => {
    fs.writeFile(DB_PATH, JSON.stringify(chat), function(error) {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

// Set static folder
app.use(express.static('public'));

// Run when client connects
io.on('connection', socket => {
  socket.on('joinRoom', () => {
    socket.emit('chatRooms', chatRooms);
  });
  socket.on('join', (room) => {
    socket.join(room, () => {
      for (var i = 0; i < chat.length; i++) {
        if (chat[i].room === room) {
          socket.emit('messages', chat[i].messages)
        };
      };
    });
  });

  // Broadcast when a user connects
  socket.on('new_message', (data) => {
    let message = {
      username: data.username,
      content: data.content
    };
    socket.broadcast
      .to(data.room)
      .emit('message',
       data, `${data.username} has joined the chat`);

    for (var i = 0; i < chat.length; i++) {
      if (chat[i].room == data.room) {
        chat[i].messages.push(message);
      }
    }
    save();
  });

  socket.on('add-room', (data) => {
    let new_room = {
      room: data,
      messages: []
    }

    chat.push(new_room);
    chatRooms.push(data);
    save();
    socket.emit('chatRooms', chatRooms);
  });

  socket.on('delete', (data) => {
    let removeRoom = chatRooms.indexOf(data);

    if (removeRoom > 0) {
      chat.splice(removeRoom, 1);
      chatRooms.splice(removeRoom, 1);
      save();
      socket.emit('chatRooms', chatRooms);
    } else if (removeRoom == 0) {
      chat.shift();
      chatRooms.shift();
      save();
      socket.emit('chatRooms', chatRooms);
    };
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));