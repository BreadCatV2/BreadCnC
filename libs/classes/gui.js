class Gui {
    constructor(parent) {
        if (parent) {
            this.parent = parent;
            parent.kill();
        }
        this.start();
    }
    
    cls() {
        // eslint-disable-next-line no-control-regex
        process.stdout.write("\x1bc");
    }

    hide(shouldHide) {
        if (shouldHide) {
            //use hex codes to hide the cursor instead of octal
            process.stdout.write("\x1b[?25l");
        } else {
            // eslint-disable-next-line no-control-regex
            process.stdout.write("\x1b[?25h");
        }
    }

    async guiHandler() {
        this.handlerLoop = setInterval(async () => {
        }, 0);
    }

    async kill() {
        if (this.handlerLoop) {
            clearInterval(this.handlerLoop);
        }
        process.stdin.removeAllListeners();
        if (this.parent) {
            await this.parent.start();
        }
    }

    async start() {
        await this.kill();
        await this.setupStdin();
        await this.guiHandler();
    }
}

module.exports = Gui;