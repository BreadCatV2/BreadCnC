const { EventEmitter } = require('stream');

class Client {
    constructor(socket) {
        this.socket = socket;
        this.setupListeners();
    }
    
    events = new EventEmitter()

    async getSock() {
        return this.socket
    }

    async setupListeners() {
        this.socket.on('data', (data) => {
            console.log(data.toString());
        });

        this.socket.on('close', () => {
            this.events.emit('close', this)
        });
    
        this.socket.on('error', (err) => {});
    }

    async sendMsg(msg) {
        this.socket.write(msg);
    }
}

module.exports = Client