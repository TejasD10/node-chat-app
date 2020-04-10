'use strict';

// Track the users in an array for now
const users = [];

// Add a new user to the array when a new user joins the chat
const addUser = ({ id, username, room }) => {
    // Validate the input
    if (!username || !room) {
        return {
            error: 'Username and room are required!'
        }
    }
    /* Convert them to lowercase so we can identify users with different cases as same
    users */
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();

    // Check for existing user
    const isUserExisting = users.find((user) => {
        return user.room === room && user.username === username;
    });
    // Error out if there is a user existing with the same name
    if (isUserExisting) { return { error: 'Username already taken!' } }

    // Add the user
    const user = {
        id: id,
        username: username,
        room: room
    };
    users.push(user);
    return { user }
};

// Remove an existing user
const removeUser = (id) => {
    // Find the index of the user by id in the array
    const index = users.findIndex(user => user.id === id);
    if (index === -1) {
        return { error: 'No user found!' };
    }
    // Remove the user
    return users.splice(index, 1)[0];
};


// Get a user based on Id.
const getUser = (id => users.find(user => user.id === id));

// Get users in a room
const getUsersInRoom = (room) => {
    if (!room) return []
    room = room.trim().toLowerCase();
    return users.filter(user => user.room === room);
};

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
};