const { logTypes } = require('./guiFuncs/log');
const Gui = require('./classes/Gui');
const Server = require('../server/Server');

class ClientList extends Gui {
    clientLeng = 0;
    selRow = 0;

    async guiHandler() {
        console.log = logTypes.silent;
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
                process.stdout.write(`Client List - ${Server.instance.clients.length} Clients - Press ESC to Exit`);
            }
            if (this.clientLeng !== Server.instance.clients.length) {
                this.clientLeng = Server.instance.clients.length;
                await this.cls();
                this.hide(true);
                process.stdout.cursorTo(0, 0);
                process.stdout.write(`Client List - ${Server.instance.clients.length} Clients - Press Enter to Exit`);
                if (this.selRow > Server.instance.clients.length-1) {
                    this.selRow = 0;
                }
                if (this.selRow < 0) {
                    this.selRow = Server.instance.clients.length-1;
                }

                let id = 0
                Server.instance.clients.forEach((client) => {
                    process.stdout.cursorTo(0, id+1);
                    let selected = this.selRow === id ? '>' : ' ';
                    let row = `${selected}  ${id} - ${client.socket.remoteAddress}:${client.socket.remotePort}`
                    process.stdout.write(`${row}`);
                    id++;
                });
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
                this.selrow--;
            }
            //down
            if (data === '\u001B\u005B\u0042') {
                this.selrow++;
            }
            //escape
            if (data === '\u001B') {
                this.exit();
            }
            //enter
            if (data === '\r') {
                //tbd - client menu
            }
        });
    }
}

module.exports = {
    ClientList
};