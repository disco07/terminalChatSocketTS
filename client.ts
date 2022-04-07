const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin,  output: process.stdout });

rl.question('Votre nom ? ', (name) => {
    const socket = require('socket.io-client')('http://localhost:3000')
    let connected = false;

    socket.on('disconnect', () => {
        socket.emit('disconnect')
    });

    const sendMsg = () => {
        rl.question('> ', (message) => {
            console.log(`Vous: ${message}`);
            socket.emit('chatmessage', ({name, message}));
            sendMsg();
        });
    }

    socket.on('logged', (boolean) => {
        console.log(boolean)
        connected = boolean

        if (connected) {
            console.log('=== demarrage du chat ===')
            sendMsg();
        }
    })
    socket.on('error', (err) => console.log(err))

    socket.on('connect', () => {
        if (connected) {
            console.log('=== demarrage du chat ===')
            sendMsg();
        } else {
            socket.emit('login', `${name}`);
        }
    })

    socket.on('chatmessage', ({name, message}) => {
        console.log(name, ':', message);
    });
})