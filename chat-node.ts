const http = require('http').createServer();
const io = require('socket.io')(http);
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
io.on('disconnect', (evt) => {
    console.log('disconnected')
})
http.listen(PORT, () => console.log(`server listening on port: ${PORT}`))