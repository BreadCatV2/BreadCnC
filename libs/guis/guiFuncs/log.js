const fs = require('fs');
const ogConsole = console.log;

const log = [];
const logHeight = 10;

//create the log file if it does not exist
const logFile = fs.createWriteStream('log.txt', { flags: 'a' });

module.exports = {
    ogConsole,
    logRender,
}

async function logRender(height) {
    if (console.log !== newLog) {
        console.log = newLog;
    }
    const logX = 0;
    const logY = height - logHeight;
    
    //dynamicly render the log to the screen, this will be called every time a new log is added
    for (let i = 0; i < logHeight; i++) {
        process.stdout.cursorTo(logX, logY + i);
        process.stdout.write((log[i] || '').padEnd(process.stdout.columns));
    }
}

const newLog = function(...args) {
    //get the text to log
    const text = args.join(' ');
    //add the text to the log
    log.push(text);
    //remove the oldest log if the log is longer than the logHeight
    if (log.length > logHeight) {
        log.shift();
    }
    logRender(process.stdout.rows);
    //write the log to the log file
    logFile.write(text+'\r\n');
}