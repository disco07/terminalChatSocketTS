const http = require('http').createServer();
const io = require('socket.io')(http);
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'test'
});
connection.connect((err) => {
    if (err) {
        console.error('Impossible de se connecter ', err);
    }
});

const PORT = 3000
const users = {}

io.on('connection', (socket) => {
    console.log('connected')

    let me = {
        username: '',
        id: 0
    }

    let eventName = 'chatmessage';

    let broadcast = (msg) => socket.broadcast.emit(eventName, msg);

    socket.on(eventName, (msg) => {
        console.log('message: ' + msg);
        // broadcast to other clients after 1.5 seconds
        setTimeout(broadcast, 1500, msg);
    });

    socket.on('login', (user) => {
        connection.query('SELECT * FROM users WHERE id = ?', [user], (err, rows, fields) => {
            console.log(rows, fields)
            if (err) {
                socket.emit('error', err.code);
                socket.emit('logged', false);
            }else if(rows.length === 1 && rows[0].token === user.token) {
                me = {
                    username: rows[0].username,
                    id: rows[0].id,
                };
                socket.emit('logged', true);
                users[me.id] = me;
                io.sockets.emit('newusr', me);
            } else {
                io.sockets.emit('error', 'Aucun utilisateur ne correspond');
                socket.emit('logged', false);
            }
        })
    })
})
io.on('disconnect', () => {
    console.log('disconnected')
})
http.listen(PORT, () => console.log(`server listening on port: ${PORT}`))