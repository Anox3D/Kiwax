const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const { userJoin, getCurrentUser, userLeave, getRoomUsers} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const botName = 'Kiwax Bot'

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Runs when client connects
io.on('connection', socket => {
    socket.on('joinRoom', ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

        socket.join(user.room);

        // Welcome current user
        socket.emit('message', formatMessage(botName, 'Bienvenue sur Kiwax !'));

        // Broadcast when a user connects
        const joinedMessage = [`${user.username} a rejoint le chat.`, `Un ${user.username} sauvage apparaît !`, `Souhaitez la bienvenue à ${user.username}.`];
        const joinedMessage_index = Math.floor(Math.random() * joinedMessage.length);
        socket.broadcast.to(user.room).emit('message', formatMessage(botName, joinedMessage[joinedMessage_index]));
    });

    // Listen for chatMessage
    socket.on('chatMessage', msg => {    
        io.emit('message', formatMessage('USER', msg));
    });
    
    // Runs when client disconnects
    const disconnectedMessage = ['Un utilisateur est parti du chat.', 'Un utilisateur disparaît !', 'Au revoir utilisateur !'];
    const disconnectedMessage_index = Math.floor(Math.random() * disconnectedMessage.length);
    socket.on('disconnect', () => {
        io.emit('message', formatMessage(botName, disconnectedMessage[disconnectedMessage_index]));
    });
})

const PORT = 2000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));