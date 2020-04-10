const socket = io();

// Get access to the elements
const $chatForm = document.querySelector('form');
const $submitButton = document.querySelector('#submit');
const $messageFormInput = $chatForm.querySelector('input');
const $shareLocation = document.querySelector('#share-location');
const $messages = document.querySelector('#messages');

// Get the mustache templates
const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationTemplate = document.querySelector('#location-template').innerHTML;
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;

// Options
const { username, room } = Qs.parse(location.search.substring(1));

// Receive the message event
socket.on('message', (message) => {
    const messageHtml = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    });
    $messages.insertAdjacentHTML('beforeend', messageHtml);
});

// Emit the join event to the server
socket.emit('join', { username, room }, (error) => {
    if (error) {
        alert(error);
        // Take them back to index
        location.href = '/';
    }
});
// Receive the roomData event to update the sidebar
socket.on('roomData', ({ room, users }) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    });
    document.querySelector('#sidebar').innerHTML = html;
});
// Receive the location message from the server
socket.on('locationMessage', (location) => {
    const locationHtml = Mustache.render(locationTemplate, {
        username: location.username,
        location: location.url,
        createdAt: moment(location.createdAt).format('h:mm a')
    });
    $messages.insertAdjacentHTML('beforeend', locationHtml);
});

// Associate the onClick event
$chatForm.addEventListener('submit', (event) => {
    event.preventDefault();
    // Disable the submit button
    $submitButton.setAttribute('disabled', 'true');
    // message text
    const messageText = $messageFormInput.value;
    socket.emit('sendMessage', messageText, (error) => {
        // Enable the button in the callback
        $submitButton.removeAttribute('disabled');
        $messageFormInput.value = '';
        $messageFormInput.focus();
        if (error) { return console.log(error); }

    });
});

// Share your location
$shareLocation.addEventListener('click', (event) => {
    // Check if the browser supports the geolocation
    if (!navigator.geolocation) {
        return alert('Your browser does not support geeolocation');
    }
    $shareLocation.setAttribute('disabled', 'true');
    // Get access to the geolocation
    navigator.geolocation.getCurrentPosition((position) => {
        // Send the location
        socket.emit('shareLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, (err) => { // Message ack called by the server
            // Enable the button
            $shareLocation.removeAttribute('disabled');
            if (err) { console.error(err); }
        });
    });
});