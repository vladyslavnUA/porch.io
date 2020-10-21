module.exports = (io, socket, onlineUsers, channels) => {

    socket.on('new user', (username) => {
        // save the username as key to access the user's socket id
        onlineUsers[username] = socket.id;
        // save the username to socket as well. This is important for later.
        socket["username"] = username;
        console.log(`✋ ${username} has joined the chat! ✋`);
        io.emit("new user", username);
    })
  
    socket.on('new message', (data) => {
        //Save the new message to the channel.
        channels[data.channel].push({sender : data.sender, message : data.message});
        //Emit only to sockets that are in that channel room.
        io.to(data.channel).emit('new message', data);
    });

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