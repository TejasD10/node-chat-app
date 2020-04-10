// Generate the message that is going to be sent to the client
const generatedMessage = (username, text) => {
    return {
        username,
        text,
        createdAt: new Date().getTime()
    };
};

// Generate the location message for the client
const generateLocationMessage = (username, url) => {
    return {
        username,
        url,
        createdAt: new Date().getTime()
    };
};
module.exports = {
    generatedMessage,
    generateLocationMessage
};