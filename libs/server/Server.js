const net = require('net');
const Client = require('./classes/Client')

class Server {
    static instance = null;
    online = false;
    clients = []

    constructor(port) {
        this.port = port;
        Server.instance = this;
    }

    async start() {
        this.server = net.createServer();
        this.server.listen(this.port);
        this.online = true;
        this.setupListeners();
        console.log(`Server listening on port ${this.port}`);
    }

    async stop() {
        this.server.close();
        this.clients.forEach((client) => {
            client.socket.destroy();
        });
        this.clients = [];
        this.online = false;
        console.log(`Server stopped`);
    }

    async toggle() {
        if (this.online) {
            this.stop();
        } else {
            this.start();
        }
    }

    async setupListeners() {
        this.server.on('connection', (socket) => {
            this.acceptConnection(socket);
        });
        this.server.on('error', (err) => {
            console.log(err);
        });
    }

    async acceptConnection(socket) {
        const client = new Client(socket)

        client.events.on('close', (clientInstance) => {
            console.log(`Client ${clientInstance.socket.remoteAddress}:${clientInstance.socket.remotePort} disconnected`);
            this.clients = this.clients.filter((client) => client !== clientInstance)
        })

        const { remoteAddress, remotePort } = socket
        console.log(`New connection from ${remoteAddress}:${remotePort}`);
        this.clients.push(client);
    }
}

module.exports = Server