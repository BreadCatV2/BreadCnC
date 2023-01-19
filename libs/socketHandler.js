const sockets = [];

module.exports = {
    acceptConnection,
    socketList,
    nickname,
}

async function acceptConnection(socket) {
    socketEventHandler(socket);
    const { remoteAddress, remotePort } = socket;
    console.log(`New connection from ${remoteAddress}:${remotePort}`);
    sockets.push(socket);
}

async function socketList() {
    //create a object of all the sockets with relevant info and index as key
    const socketList = {};
    sockets.forEach((socket, index) => {
        const { remoteAddress, remotePort, nickname } = socket;
        socketList[index] = {
            ip: remoteAddress,
            port: remotePort,
            nickname: nickname || null,
        };
    });
    return socketList;
}

function nickname(index, nickname) {
    sockets[index].nickname = nickname;
}

async function socketEventHandler(socket) {
    socket.on('data', (data) => {
        console.log(data.toString());
    });

    socket.on('close', () => {
        console.log('Socket disconnected');
        sockets.splice(sockets.indexOf(socket), 1);
    });

    socket.on('error', (err) => {});
}