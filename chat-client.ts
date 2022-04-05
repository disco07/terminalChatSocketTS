const socket = require('socket.io-client')('http://localhost:3000'); //communique sur l'adresse qui dans le server socket
const repl = require('repl'); // permet de créer un terminal

socket.on('disconnect', function() {
    socket.emit('disconnect')
});
socket.on('connect', () => {
    console.log('=== demarrage du chat ===')
})
socket.on('message', (data) => {
    const { cmd, username } = data
    console.log(username + ': ' + cmd.split('\n')[0]);
})
repl.start({
    prompt: '',
    eval: (cmd) => {
        socket.send(cmd)
    }
})