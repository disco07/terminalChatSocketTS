const http = require('http').createServer();
const io = require('socket.io')(http);
const PORT = 3000
io.on('connection', (socket) => {
    console.log('connected')
})
io.on('disconnect', (evt) => {
    console.log('disconnected')
})
http.listen(PORT, () => console.log(`server listening on port: ${PORT}`))