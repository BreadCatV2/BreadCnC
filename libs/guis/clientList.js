const { logTypes } = require('./guiFuncs/log');

let handlerLoop = null;
let callerGui = null;

async function setupListeners() {
process.stdin.on('data', async (data) => {
    //if the user presses the escape key
    process.stdin.setRawMode(false);
    process.stdin.removeAllListeners('data');
    console.log(data);
    process.stdout.write('Data: ' + data);
});
}

async function cls() {
    process.stdout.write('\033c');
}

async function guiHandler() {

    console.log = logTypes.basic;

    //create a new listener
    setupListeners();
    //reset the terminal#
    await cls();
    //get name of caller function
    callerGui = arguments.callee.caller.name;
    
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

async function setupListeners() {
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

async function kill() {
    process.stdin.removeAllListeners('data');
    process.stdin.setRawMode(false);
    clearInterval(handlerLoop);
    if (callerGui) {
        console.log('callerGui')
        //call the callerGui function
        await callerGui();
    }
}

async function start(caller) {
    if (caller) {
        callerGui = caller;
    }
    await kill();
    await guiHandler();
}

module.exports = {
    start
};