const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const { generateMessage, generateLocationMessage } = require('./utils/messages');
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT;
// Define paths for express config
const publicDirPath = path.join(__dirname, '../public');

// setup static diretories to be served (index will be referred automatically for homepage as index.html has a special meaning to the servers)
app.use(express.static(publicDirPath));

io.on('connection', (socket) => {
    console.log('new WebSocket connection!');   

    socket.on('join', ({ username, room }, callback) => {
        const { error, user } = addUser({ id: socket.id, username, room });

        if (error) {
            return callback(error);
        }

        socket.join(user.room);

        socket.emit('message', generateMessage('Admin', 'welcome to POST messenger...'));
        socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} has joined!`));

        // updating sidebar
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        });

        callback();
    }); 
    
    socket.on('sendMessage', (msgText, callback) => {
        const user = getUser(socket.id);

        socket.broadcast.to(user.room).emit('message', generateMessage(user.username, msgText, false));
        socket.emit('message', generateMessage(user.username, msgText, true));
        callback();     // for aknowledment 
    });
    
    socket.on('sendLocation', (coords, callback) => {
        const user = getUser(socket.id);

        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, coords));
        callback();
    });

    socket.on('disconnect', () => {
        const user = removeUser(socket.id);
        
        if (user) {
            io.to(user.room).emit('message', generateMessage('Admin', `${user.username} has left!`));
            
            // updating sidebar
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            });
        }
    })
});

server.listen(port, () => {
    console.log(`Server Up and Running on port ${port}`);
});