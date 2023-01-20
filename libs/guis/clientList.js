const { logTypes } = require('./guiFuncs/log');
const Gui = require('../classes/gui');

class ClientList extends Gui {
    async guiHandler() {
        console.log = logTypes.basic;

        //create a new listener
        setupListeners();
        //reset the terminal#
        await cls();

        let finished = false;
        return new Promise(async (resolve) => {
            //interval
            setInterval(async () => {
                if (finished) {
                    clearInterval(this);
                    return;
                }
                //render the gui
                
            }, 0);
            resolve();
        });
    }

    async setupListeners() {
        let buffer = [];
        process.stdin.setRawMode(true);
        //utf8 encoding
        process.stdin.setEncoding('utf8');
        process.stdin.on('data', async (data) => {
            if (data === '\r') {
                await kill();
            }
        });
    }
}

module.exports = {
    ClientList
};