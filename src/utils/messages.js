const generateMessage = (username, text, userMsg) => {
    return {
        userMsg,
        username,
        text,
        createdAt: new Date().getTime()
    };
};

const generateLocationMessage = (username, coords, locMsg) => {
    return {
        username,
        locMsg,
        url: `https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`,
        createdAt: new Date().getTime()
    };
};

module.exports = {
    generateMessage,
    generateLocationMessage
};