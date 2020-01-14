const users = [];

const addUser = ({ id, username, room }) => {
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();

    // username and room both should not be null
    if (!username || !room) {
        return { error: "Username or Room can't be Null!" };
    }

    // validate username- two users with same name shouldn't exist in the same room at a time
    const userExists = users.find((user) => {
        return user.username === username && user.room === room;
    });

    if (userExists) {
        return { error: "Username is in use!" };
    }

    // save user
    const user = { id, username, room };
    users.push(user);
    return { user };
};

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id );

    if(index !== -1) {
        return users.splice(index, 1)[0];
    }
};

const getUser = (id) => {
    return users.find((user) => user.id === id);
};

const getUsersInRoom = (room) => {
    return users.filter((user) => user.room === room );
};

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
};