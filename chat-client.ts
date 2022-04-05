const socket = require('socket.io-client')('http://localhost:3000'); //communique sur l'adresse qui dans le server socket
const repl = require('repl'); // permet de créer un terminal

socket.on('disconnect', () => {
    socket.emit('disconnect')
});
socket.on('connect', () => {
    console.log('=== demarrage du chat ===')
})
socket.on('message', (data) => {
    console.log(data);
})
repl.start({
    prompt: '',
    eval: (cmd) => {
        socket.send(cmd)
    }
})