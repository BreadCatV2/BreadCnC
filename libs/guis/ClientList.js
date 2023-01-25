const { logTypes } = require('./guiFuncs/log');
const Gui = require('../classes/Gui');

class ClientList extends Gui {
    async guiHandler() {
        console.log = logTypes.basic;
        process.stdout.write("GUI Handler");
        this.hide(true);   
        this.width = 0;
        this.height = 0;
        this.setHandlerLoop(async () => {
            //if the terminal width < 100 or the terminal height < 30 then resize them individually
            // if console is resized
            //if the heigt is sm
            if (this.width !== process.stdout.columns || this.height !== process.stdout.rows) {
                //if the terminal width < 100 or the terminal height < 30 then resize them individually
                this.width = process.stdout.columns;
                this.height = process.stdout.rows;
                this.cls()
            }
        }, 0)
    }

    async setupStdin() {
        let buffer = [];
        process.stdin.setRawMode(true);
        process.stdout.write("STDIN Setup");
        process.stdin.setEncoding('utf8');
        process.stdin.on('data', async (data) => {
            if (data === '\r' || data === '\n') {
                await this.exit();
            }
            process.stdout.write(data);
        });
    }
}

module.exports = {
    ClientList
};