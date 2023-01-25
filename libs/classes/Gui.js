class Gui {
    handlerLoop = null;

    constructor(parent) {
        if (parent) {
            this.parent = parent;
        }
        this.start();
    }

    setHandlerLoop(func, delay) {
        delay = delay || 0;
        this.handlerLoop = setInterval(func, delay);
    }

    cls() {
        process.stdout.write("\x1bc");
        if (this.render) {
            this.render();
        }
    }

    hide(shouldHide) {
        if (shouldHide) {
            process.stdout.write("\x1b[?25l");
        } else {
            process.stdout.write("\x1b[?25h");
        }
    }

    async kill() {
        if (this.handlerLoop) {
            clearInterval(this.handlerLoop);
        }
        //reset stdin
        if (process.stdin.isTTY) {
            process.stdin.setRawMode(false);
        }
        process.stdin.setEncoding('utf8');
        process.stdin.removeAllListeners('data');
    }

    async start() {
        if (this.parent) {
            await this.parent.kill();
        }

        await this.setupStdin();
        await this.guiHandler();
    }

    async exit() {
        await this.kill();
        if (this.parent) {
            await this.parent.start();
        } else {
            process.exit();
        }
    }
}

module.exports = Gui;