const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin,  output: process.stdout });

interface IMesInfos {
    username?: string
    id?: number
}

rl.question('Votre nom ? ', (name) => {
    const socket = require('socket.io-client')('http://localhost:3000')
    let connected = false;

    let mesInfos: IMesInfos = {
        username: '',
        id: 0
    }

    socket.on('disconnect', () => {
        socket.emit('disconnect')
    });

    const sendMsg = () => {
        rl.question('> ', (message) => {
            console.log(`Vous: ${message}`);
            socket.emit('chatmessage', ({name, message}), mesInfos);
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
    socket.on('newmsg', (message) => {
        message.forEach(msg => {
            console.log(msg.user.username, ':', msg.message)
        })
    })
    socket.on('newusr', (me) => {
        mesInfos = {
            username: me.username,
            id: me.id,
        };
    })

    socket.on('connect', () => {
        if (connected) {
            console.log('=== demarrage du chat ===')
            sendMsg();
        } else {
            socket.emit('login', `${name}`);
        }
    })

    socket.on('chatmessage', (data) => {
        let username: any = data.filter(d => d.username)
        let message: any = data.filter(d => d.message)
        console.log(username[0].username, ':', message[0].message);
    });
})