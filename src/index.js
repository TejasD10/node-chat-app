const { server, io } = require('./app');
const { generatedMessage, generateLocationMessage } = require('./helpers/messages');
const { addUser, removeUser, getUser, getUsersInRoom } = require('./helpers/users')

// Setup the server connection event
io.on('connection', (socket) => {

    // Receive the join room event
    socket.on('join', (options, callback) => {
        // Add the joining user
        const { error, user } = addUser({ id: socket.id, ...options });

        if (error) return callback(error);

        // Use the join method on socket to join a specific room
        socket.join(user.room);

        // As soon as the client gets connected, emit a message event to the client
        socket.emit('message', generatedMessage('Admin', 'Welcome!'));

        // Broadcast an event for sidebar
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        });
        // Broadcast to all the "other" users of a person joining in
        socket.broadcast.to(user.room).emit('message', generatedMessage('Admin', `${user.username} has joined!`));
    });

    // Receive the sendMessage event and relay the messgae sent by the client
    // to the other connected clients in the room
    socket.on('sendMessage', (message, ack) => {
        // Get the user associated with this message
        const user = getUser(socket.id);
        if (!user) return ack(error);

        // Emit the event to all the clients
        io.to(user.room).emit('message', generatedMessage(user.username, message));

        // Acknowledge that the message is sent to the client
        ack();
    });

    // On the user disconnecting, publish to all the connected users that a user has disconnected
    socket.on('disconnect', () => {
        // Remove the user
        const user = removeUser(socket.id);

        if (user) {
            io.to(user.room).emit('message', generatedMessage('Admin', `${user.username} has left!`));
            // Broadcast an event for sidebar
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            });
        }
    });

    // Receive share location and send it to the others in the chat
    socket.on('shareLocation', (coords, ack) => {
        // Get the user associated with this message
        const user = getUser(socket.id);
        if (!user) return ack(error);

        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, `https://google.com/maps?q=${coords.latitude},${coords.longitude}`));
        // Call the acknowledgement
        ack();
    });
});

const port = process.env.PORT || 3001

// Start the server
server.listen(port, () => console.log(`Server started on ${port}`))