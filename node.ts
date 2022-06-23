const http = require('http').createServer();
const io = require('socket.io')(http);
const mysql = require('mysql');

interface IMessage {
    message: string;
    user: {
        id: number
        username: string
    }
}

interface IMesInfos {
    username?: string
    id?: number
}

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

const PORT: number = 3000
const users: {} = {}

io.on('connection', (socket) => {
    console.log('connected')

    let me: {username: string, id: number} = {
        username: '',
        id: 0
    }

    let eventName = 'chatmessage';

    let broadcast = (data) => socket.broadcast.emit(eventName, data);

    socket.on(eventName, ({name, message}: any, mesInfos: IMesInfos) => {
        console.log(message, mesInfos);
        setTimeout(broadcast, 1000, [{username: mesInfos.username}, {message}]);

        connection.query('INSERT INTO messages SET user_id = ?, message = ?', [
            mesInfos.id,
            message,
        ], (err) => {
            if (err) {
                console.log(err)
                socket.emit('error', err.code)
            }
        })
    });

    socket.on('login', (userId: number) => {
        connection.query('SELECT * FROM users WHERE id = ?', [userId], (err, rows, fields) => {
            console.log(rows, fields)
            if (err) {
                socket.emit('error', err.code);
                socket.emit('logged', false);
                io.to(socket.id).emit('error', 'Aucun utilisateur trouvé');
            } else if (rows.length === 1) {
                me = {
                    username: rows[0].username,
                    id: rows[0].id,
                };
                socket.emit('logged', true);
                users[me.id] = me;
                io.to(socket.id).emit('newusr', me);

                connection.query('SELECT users.id as user_id, users.username, messages.message FROM messages LEFT JOIN users ON users.id = messages.user_id ORDER BY messages.id DESC LIMIT 10', (err, rows) => {
                    if (err) {
                        socket.emit('error', err.code);
                    } else {
                        let messages: IMessage[] = [];
                        rows.reverse(); // On veut les plus vieux en premier
                        for (let k in rows) {
                            let row = rows[k];
                            let message: IMessage = {
                                message: row.message,
                                user: {
                                    id: row.user_id,
                                    username: row.username,
                                }
                            };
                            messages.push(message)
                        }
                        io.to(socket.id).emit('newmsg', messages)
                    }
                })

            } else {
                io.to(socket.id).emit('error', 'Aucun utilisateur trouvé');
                socket.emit('logged', false);
            }
        })
    })
})
io.on('disconnect', () => {
    console.log('disconnected')
})
http.listen(PORT, () => console.log(`server listening on port: ${PORT}`))