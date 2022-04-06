const http = require('http').createServer();
const io = require('socket.io')(http);
const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'test'
});
connection.connect(function(err){
    if(err){
        console.error('Impossible de se connecter ', err);
    }
});


const PORT = 3000

io.on('connection', (socket) => {
    console.log('connected')
    socket.on('message', (evt) => {
        console.log(evt)
        // les informations envoyées depuis le clients sont recus par le server et dispatchés par ici
        // socket.broadcast.emit permet d'envoyer à toutes les personnes connectées sauf à soi-meme
        socket.broadcast.emit('message', evt)
    })
})
io.on('disconnect', () => {
    console.log('disconnected')
})
http.listen(PORT, () => console.log(`server listening on port: ${PORT}`))