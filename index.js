const net = require('net');
var config = require('./config.json');

const Menu = require('./libs/guis/Menu');

const socketHandler = require('./libs/socketHandler.js');
const { acceptConnection, socketList } = socketHandler;
//accept socket connections
const server = net.createServer();

const mainMenu = new Menu();

//handle socket connections
server.on('connection', (socket) => {
    acceptConnection(socket);
});

server.listen(config.port, () => {
    console.log('Server listening on port ' + config.port);
});