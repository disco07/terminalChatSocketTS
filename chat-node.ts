const http = require('http').createServer();
const io = require('socket.io')(http);
const PORT = 3000
io.on('connection', (socket) => {
    console.log('connected')
    socket.on('message', (evt) => {
        console.log(evt)
        socket.broadcast.emit('message', evt)
    })
})
io.on('disconnect', (evt) => {
    console.log('disconnected')
})
http.listen(PORT, () => console.log(`server listening on port: ${PORT}`))