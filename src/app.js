const express = require('express');
const path = require('path');
const socketio = require('socket.io');
const http = require('http');

// Setup the express app
const app = express();

// Setup the static routes
const staticPath = path.join(__dirname, '../public');

// Setup express to use the static paths
app.use(express.static(staticPath));

app.get("/", (req, res) => {
    res.render('index')
});

// Setup the server to get access to the raw http server to create the socketio server
const server = http.createServer(app);

// Initiate socketio
const io = socketio(server);

// Export the app setup
module.exports = {server, io}