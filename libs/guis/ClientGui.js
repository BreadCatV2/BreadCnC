const Client = require('../server/classes/Client');
const Gui = require('./classes/Gui');

class ClientGui extends Gui {
    constructor(parent, client) {
        this.client = client;
        if (parent) {
            this.parent = parent;
        }
        this.start();
    }

    async guiHandler() {
        this.cls();
        this.hide(true);
        this.width = 0;
        this.height = 0;
        this.setHandlerLoop(async () => {
            if (this.width !== process.stdout.columns || this.height !== process.stdout.rows) {
                this.width = process.stdout.columns;
                this.height = process.stdout.rows;
                this.cls()
                this.hide(true);
                process.stdout.cursorTo(0, 0);
                let stdoutStr = '\x1b[4m' + `Client Gui - ${this.client.socket.remoteAddress}:${this.client.socket.remotePort} - Press Escape to Exit!`
                stdoutStr += ' '.repeat(this.width - stdoutStr.length) + '\x1b[0m';
                process.stdout.write(stdoutStr);
            }
        }, 0)
    }

    async setupStdin() {
        let buffer = [];
        process.stdin.setRawMode(true);
        process.stdout.write("STDIN Setup");
        process.stdin.setEncoding('utf8');
        process.stdin.on('data', async (data) => {
            //up
            if (data === '\u001B\u005B\u0041') {
                this.client.send('up');
            }
            //down
            if (data === '\u001B\u005B\u0042') {
                this.client.send('down');
            }
            //left
            if (data === '\u001B\u005B\u0044') {
                this.client.send('left');
            }
            //right
            if (data === '\u001B\u005B\u0043') {
                this.client.send('right');
            }
            //escape
            if (data === '\u001B\u005B\u0043') {
                this.client.send('escape');
            }
        });
    }
}

module.exports = ClientGui;