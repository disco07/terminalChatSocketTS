const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin,  output: process.stdout });

interface IMesInfos {
    username?: string
    id?: number
}

interface IMessage {
    message: string;
    user: {
        id: number
        username: string
    }
}

interface IData {
    username: string
    message: string
}

rl.question('Votre nom ? ', (name: string) => {
    const socket = require('socket.io-client')('http://localhost:3000')
    let connected: boolean = false;

    let mesInfos: IMesInfos = {
        username: '',
        id: 0
    }

    socket.on('disconnect', () => {
        socket.emit('disconnect')
    });

    const sendMsg = () => {
        rl.question('> ', (message: string) => {
            console.log(`Vous: ${message}`);
            socket.emit('chatmessage', ({name, message}), mesInfos);
            sendMsg();
        });
    }

    socket.on('logged', (boolean: boolean) => {
        console.log(boolean)
        connected = boolean

        if (connected) {
            console.log('=== demarrage du chat ===')
            sendMsg();
        }
    })
    socket.on('error', (err) => console.log(err))
    socket.on('newmsg', (message: IMessage[]) => {
        message.forEach(msg => {
            console.log(msg.user.username, ':', msg.message)
        })
    })
    socket.on('newusr', (me: {username: string, id: number}) => {
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

    socket.on('chatmessage', (data: IData[]) => {
        let username: any = data.filter(d => d.username)
        let message: any = data.filter(d => d.message)
        console.log(username[0].username, ':', message[0].message);
    });
})