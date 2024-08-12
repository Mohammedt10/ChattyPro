const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

let onlineUsers = 0;

io.on('connection', (socket) => {
    const randNum = Math.round(Math.random() * 1000000);
    const guestUsername = 'Guest' + randNum;
    onlineUsers++;
    socket.emit('user connect', onlineUsers);

    socket.on('disconnect', () => {
        onlineUsers--;
        socket.emit('user disconnect', onlineUsers);
    });

    socket.on('chat message', (msg, msgTime, username, profilePic, imgBgColor) => {
        username = username.trim();
        if (username.length > 15 || !username || username.toLowerCase() === 'chatty') {
            username = guestUsername;
        }
        if (msg.length < 15000) {
            socket.broadcast.emit('chat message', msg, msgTime, username, profilePic, imgBgColor);
        }
    });
});

server.listen(port, () => {
    console.log('Listening on port: ' + port);
});
