const net = require('net');
const config = require('./config.json');
const { guiHandler } = require('./libs/guis/menu');

const socketHandler = require('./libs/socketHandler.js');
const { acceptConnection, socketList } = socketHandler;
//accept socket connections
const server = net.createServer();

guiHandler()

//handle socket connections
server.on('connection', (socket) => {
    acceptConnection(socket);
});

server.listen(config.port, () => {
    console.log('Server listening on port ' + config.port);
});