var config = require('./config.json');

const Server = require('./libs/server/Server');
const Menu = require('./libs/guis/Menu');

const port = config.port;

if (!port) {
    console.log('Please specify a port in the config.json file');
    process.exit(1);
}

const server = new Server(port);
if (!config.headless) {
    const menu = new Menu();
}