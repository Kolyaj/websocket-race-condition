var server = require('http').createServer(function(req, res) {
    if (req.url == '/') {
        res.end('<script src="client.js"></script>');
    } else if (req.url == '/client.js') {
        require('fs').readFile('client.js', 'utf8', function(err, content) {
            if (err) {
                res.writeHead(500, {
                    'Content-Type': 'text/plain'
                });
                res.end(err.stack);
                return;
            }
            res.end(content);
        });
    }
});

var WebSocketServer = require('websocket').server;
var wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: true
});
wsServer.on('connect', function(socket) {
    var i = 0;
    (function next() {
        socket.sendUTF('message #' + i);
        i++;
        if (i < 5) {
            setTimeout(next, 20);
        }
    })();
});

server.listen(3003);
console.log('Server has started on port 3003');
