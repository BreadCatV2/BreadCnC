const readline = require('readline')
const process = require('process')
const figlet = require('figlet')
const gradient = require('gradient-string')

const { logRender } = require('./guiFuncs/log')

//this will be the gui of the server
let selrow = 0
let selcolumn = 0

let offset = 0

const gui = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

module.exports = {
    guiHandler
}

async function cls() {
    process.stdout.write('\033c');
    render();
}

async function hide(shouldHide) {
    if (shouldHide) {
        process.stdout.write('\033[?25l');
    } else {
        process.stdout.write('\033[?25h');
    }
}

async function titleRender(width, height) {
    const orangeRed = gradient('orange', 'red');
    const text = figlet.textSync('BreadCnC', {
        font: 'Standard',
        horizontalLayout: 'default',
        verticalLayout: 'default'
    })
    const title = orangeRed.multiline(text)
    const titleWidth = text.split('\n')[0].length;
    const titleHeight = text.split('\n').length;

    const titleX = Math.floor(width / 2 - titleWidth / 2);
    const titleY = Math.floor(height / 2 - titleHeight / 2) / 4;
    
    const titleLines = title.split('\n');
    for (let i = 0; i < titleLines.length; i++) {
        process.stdout.cursorTo(titleX, titleY + i);
        process.stdout.write(titleLines[i]);
    }
    return titleY + titleHeight;
}

async function menuRender(width, offset) { 
    const menu = [
        'list',
        'help',
        'settings',
        'bulkAction',
        'exit',
        'test1',
        'test2',
        'test3',
        'test4',
        'test5',
        'test6',
        'test7',
    ];
    buttonHandler(menu, width, offset);
}

async function render() {
    width = process.stdout.columns;
    height = process.stdout.rows;
    offset = await titleRender(width, height)
    await menuRender(width, offset)
    await logRender(height)
}

async function renderLoop() {
    let width = 0;
    let height = 0;

    setInterval(async () => {
        if (process.stdout.columns < 70) {
            process.stdout.write("\033[8;"+process.stdout.rows+";70t");
        }
        if (process.stdout.rows < 40) {
            process.stdout.write("\033[8;40;"+process.stdout.columns+"t");
        }
        if (width !== process.stdout.columns || height !== process.stdout.rows) {
            //if the terminal width < 100 or the terminal height < 30 then resize them individually
            width = process.stdout.columns;
            height = process.stdout.rows;
            cls()
        }
    }, 0);
}

async function guiHandler() {
    await hide(true);
    renderLoop();
}

//custom stdin that only allows arrow keys
const stdin = process.stdin;
stdin.setRawMode(true);
stdin.resume();
stdin.setEncoding('utf8');

stdin.on('data', (key) => {
    //use switch case to handle the key presses
    switch (key) {
        case '\u001B\u005B\u0041':
            selrow--;
            break;
        case '\u001B\u005B\u0042':
            selrow++;
            break;
        case '\u001B\u005B\u0043':
            selcolumn++;
            break;
        case '\u001B\u005B\u0044':
            selcolumn--;
            break;
    }
    cls();
}); 

async function buttonHandler(buttons, width, height) {
    const buttonWidth = 15;
    const buttonHeight = 3;
    
    let columns = Math.floor(width / buttonWidth);
    if (columns > 5) {
        columns = 5;
    }
    let rows = Math.ceil(buttons.length / columns);
    
    const buttonX = Math.floor(width / columns / 2 - buttonWidth / 2);
    const buttonY = Math.floor(buttonHeight / 2) + height;
    const buttonSpacingX = Math.floor(width / columns);

    let selectedButton = selrow * columns + selcolumn;
    //if selected button is higher than the amount of buttons then set it to the first button
    if (selectedButton > buttons.length - 1) {
        selectedButton = 0;
        selrow = 0;
        selcolumn = 0;
    }
    //if selected button is lower than 0 then set it to the last button
    if (selectedButton < 0) {
        selectedButton = buttons.length - 1;
        selrow = Math.floor(buttons.length / columns);
        selcolumn = buttons.length % columns - 1;
    }

    //loop through rows and columns and render the buttons
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            const button = buttons[i * columns + j];
            if (button) {
                const buttonXPos = buttonX + buttonSpacingX * j;
                const buttonYPos = buttonY + buttonHeight * i;
                const selected = selectedButton === i * columns + j;
                renderButton(button, buttonXPos, buttonYPos, buttonWidth, buttonHeight, selected);
            }
        }
    }
}

async function renderButton(text, x, y, width, height, selected) {
    const button = 'X';
    const color = selected ? '\x1b[32m' : '\x1b[0m';
    const textX = Math.floor(x + width / 2 - text.length / 2);
    const textY = Math.floor(y + height / 2);
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            //only make the border of the button
            if (i === 0 || i === height - 1 || j === 0 || j === width - 1) {
                process.stdout.cursorTo(x + j, y + i);
                process.stdout.write(color+button);
            }
        }
    }
    process.stdout.cursorTo(textX, textY);
    process.stdout.write(text+ '\x1b[0m');
}