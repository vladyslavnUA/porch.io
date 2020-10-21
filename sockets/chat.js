module.exports = (io, socket, onlineUsers, channels) => {

    socket.on('new user', (username) => {
        // save the username as key to access the user's socket id
        onlineUsers[username] = socket.id;
        // save the username to socket as well. This is important for later.
        socket["username"] = username;
        console.log(`✋ ${username} has joined the chat! ✋`);
        io.emit("new user", username);
    })
  
    // listen for new messages
    socket.on('new message', (data) => {
        // send that data back to ALL clients
        console.log(`🎤 ${data.sender}: ${data.message} 🎤`)
        io.emit('new message', data);
    })

    socket.on('get online users', () => {
        socket.emit('get online users', onlineUsers);
    })
  
    socket.on('disconnect', () => {
        //This deletes the user by using the username we saved to the socket
        delete onlineUsers[socket.username]
        io.emit('user has left', onlineUsers);
    });

    socket.on('new channel', (newChannel) => {
        console.log(newChannel);
        channels[newChannel] = [];
        socket.join(newChannel);
        io.emit('new channel', newChannel);
        socket.emit('user changed channel', {
            channel: newChannel,
            messages: channels[newChannel]
        });
    })
}