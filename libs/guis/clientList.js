const { ogConsole } = require('./guiFuncs/log');
const { pause } = require('./menu');

module.exports = {
    guiHandler
}

async function cls() {
    process.stdout.write('\033c');
}

async function guiHandler() {
    pause();
    console.log = ogConsole;

    process.stdin.setRawMode(false);
    process.stdin.removeAllListeners('data');

    //reset the terminal#
    await cls();

    let finished = false;
    return new Promise(async (resolve) => {
        while (!finished) {
            console.log('guiHandler');
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        resolve();
    });
}