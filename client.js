var socket = new WebSocket('ws://' + location.host + '/');
socket.onopen = function() {
    console.log('socket opened');
};
socket.onmessage = function(message) {
    console.log('start', message.data);
    var now = +new Date();
    while (+new Date() < now + 150) {
        new Function();
    }
    console.log('end', message.data);
};
socket.onerror = function(err) {
    console.error(err);
};
