const readline = require('readline')
const process = require('process')
const figlet = require('figlet')
const gradient = require('gradient-string')

const Gui = require('./classes/Gui')
const Server = require('../server/Server')
const { logRender, logTypes } = require('./guiFuncs/log')
const { ClientList } = require('./ClientList')
const { Button } = require('./classes/Button')

class Menu extends Gui {
    server = Server.instance
    async settings(parent) {
        console.log('settings');
    }
    
    async bulkActions(parent) {
        console.log('bulkActions');
    }
    
    async listClients(parent) {
        return new ClientList(parent);
    }
    
    async toggleServer(parent) {
        parent.server.toggle();
    }

    async exitBtnFunc(parent) {
        await parent.exit();
    }

    btnList = new Map([
        [0, new Button('Toggle Server', this.toggleServer)],
        [1, new Button('List Clients', this.listClients)],
        [2, new Button('Bulk Actions', this.bulkActions)],
        [3, new Button('Settings', this.settings)],
        [4, new Button('Exit', this.exitBtnFunc)]
    ])
    handlerLoop = null

    selrow = 0
    selcolumn = 0
    selectedButton = 0
    offset = 0

    async titleRender(width, height) {
        if (height < 20 + Math.ceil(this.btnList.length/5)*3) {
            return 0;
        }

        const maxWidth = 100;
        let widthOffset = 0;
        if (width > maxWidth) {
            widthOffset = maxWidth;
        }
        if (width < maxWidth) {
            widthOffset = width - 10;
        }
        const orangeRed = gradient('orange', 'red');
        const text = figlet.textSync('BreadCnC', {
            font: 'Standard',
            horizontalLayout: 'default',
            verticalLayout: 'default',
            width: widthOffset,
        })
        const title = orangeRed.multiline(text)
        const titleWidth = text.split('\n')[0].length;

        const titleX = Math.floor(width / 2 - titleWidth / 2);
        const titleY = Math.floor(1);
        
        const titleLines = title.split('\n');
        for (let i = 0; i < titleLines.length; i++) {
            process.stdout.cursorTo(titleX, titleY + i);
            process.stdout.write(titleLines[i]);
        }
        
        const statusString = `Server Status: ${this.server.online ? "Online":"Offline"}\n`;
        const statusX = Math.floor(width / 2 - statusString.length / 2);
        
        process.stdout.cursorTo(statusX, titleY + titleLines.length);
        process.stdout.write(statusString);
        
        let titleHeight = titleY + titleLines.length;
        return titleY + titleHeight;
    }

    async menuRender(width, offset) { 
        this.buttonHandler(width, offset);
    }

    async render() {
        this.width = process.stdout.columns;
        this.height = process.stdout.rows;
        this.offset = await this.titleRender(this.width, this.height)
        await this.menuRender(this.width, this.offset)
        await logRender(this.height)
    }

    async guiHandler() {
        console.log = logTypes.verbose;
        this.hide(true);   
        this.width = 0;
        this.height = 0;
        this.setHandlerLoop(async () => {
            if (this.width !== process.stdout.columns || this.height !== process.stdout.rows) {
                this.width = process.stdout.columns;
                this.height = process.stdout.rows;
                this.cls()
            }
        }, 0)
    }

    async setupStdin() {
        if (process.stdin.isTTY) {
            process.stdin.setRawMode(true);
        }
        
        process.stdin.setEncoding('utf8');
        process.stdin.removeAllListeners('data');
        process.stdin.on('data', async (key) => {
            switch (key) {
                //up
                case '\u001B\u005B\u0041':
                    this.selrow--;
                    break;
                //down
                case '\u001B\u005B\u0042':
                    this.selrow++;
                    break;
                //right
                case '\u001B\u005B\u0043':
                    this.selcolumn++;
                    break;
                //left
                case '\u001B\u005B\u0044':
                    this.selcolumn--;
                    break;
                //enter
                case '\u000D':
                    this.btnList.get(this.selectedButton).run(this)
                    break;
            }
            this.cls();
        });
    }

    async buttonHandler(width, height) {
        const buttonWidth = 15;
        const buttonHeight = 3;
        
        let columns = Math.floor(width / buttonWidth);
        if (columns > 5) {
            columns = 5;
        }
        let rows = Math.ceil(this.btnList.size / columns);

        const buttonX = Math.floor(width / columns / 2 - buttonWidth / 2);
        const buttonY = Math.floor(buttonHeight / 2) + height;
        const buttonSpacingX = Math.floor(width / columns);

        this.selectedButton = this.selrow * columns + this.selcolumn;
        if (this.selectedButton > this.btnList.size - 1) {
            selectedButton = 0;
            this.selrow = 0;
            this.selcolumn = 0;
        }
        
        if (this.selectedButton < 0) {
            this.selectedButton = this.btnList.size - 1;
            this.selrow = Math.floor(this.btnList.size / columns);
            this.selcolumn = this.btnList.size % columns - 1;
        }

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                const button = this.btnList.get(i * columns + j)?.getName()
                if (button) {
                    const buttonXPos = buttonX + buttonSpacingX * j;
                    const buttonYPos = buttonY + buttonHeight * i;
                    const selected = this.selectedButton === i * columns + j;
                    this.renderButton(button, buttonXPos, buttonYPos, buttonWidth, buttonHeight, selected);
                }
            }
        }
    }

    async renderButton(text, x, y, width, height, selected) {
        const color = selected ? '\x1b[38;5;208m' : '\x1b[0m';
        const textX = Math.floor(x + width / 2 - text.length / 2);
        const textY = Math.floor(y + height / 2);
        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                if (i === 0 || i === height - 1 || j === 0 || j === width - 1) {
                    process.stdout.cursorTo(x + j, y + i);
                    if (i === 0 && j === 0) {
                        process.stdout.write(color + '┌');
                    }
                    else if (i === 0 && j === width - 1) {
                        process.stdout.write(color + '┐');
                    }
                    else if (i === height - 1 && j === 0) {
                        process.stdout.write(color + '└');
                    }
                    else if (i === height - 1 && j === width - 1) {
                        process.stdout.write(color + '┘');
                    }
                    else if (i === 0 || i === height - 1) {
                        process.stdout.write(color + '─');
                    }
                    else if (j === 0 || j === width - 1) {
                        process.stdout.write(color + '│');
                    }
                }
            }
        }
        process.stdout.cursorTo(textX, textY);
        process.stdout.write(text+ '\x1b[0m');
    }
}

module.exports = Menu