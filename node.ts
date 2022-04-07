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

    socket.on(eventName, ({name, message}) => {
        console.log('message: ' + message);
        setTimeout(broadcast, 1000, {name, message});

        connection.query('INSERT INTO messages SET user_id = ?, message = ?', [
            name,
            message,
        ], (err) => {
            if(err){
                console.log(err)
                socket.emit('error', err.code)
            }
        })
    });

    socket.on('login', (userId) => {
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