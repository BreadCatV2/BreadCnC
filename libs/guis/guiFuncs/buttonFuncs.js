class Button {
    constructor(name, func) {
        this.name = name;
        this.func = func;
    }

    getName() {
        return this.name;
    }
    run() {
        this.func();
    }
}

//exit, settings, bulkActions, listClients, toggleServer
async function exit() {
    process.exit();
}

async function settings() {
    console.log('settings');
}

async function bulkActions() {
    console.log('bulkActions');
}

async function listClients() {
    console.log('listClients');
}

async function toggleServer() {
    console.log('toggleServer');
}

//turn the function to a string
module.exports = {
    Button,
    exit,
    settings,
    bulkActions,
    listClients,
    toggleServer
}