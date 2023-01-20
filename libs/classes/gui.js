class gui {
    constructor() {
        this.start();
    }
    
    cls() {
        process.stdout.write('\033c');
    }

    hide(shouldHide) {
        if (shouldHide) {
            process.stdout.write('\033[?25l');
        } else {
            process.stdout.write('\033[?25h');
        }
    }

    async guiHandler() {}

    async kill() {
        clearInterval(handlerLoop);
        //remove all listeners
        process.stdin.removeAllListeners();
    }

    async start() {
        await kill();
        await setupStdin();
        await guiHandler();
    }
}

module.exports = gui;