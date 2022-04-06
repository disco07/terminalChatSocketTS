const socket = require('socket.io-client')('http://localhost:3000'); //communique sur l'adresse qui dans le server socket
const repl = require('repl'); // permet de créer un terminal

// ('disconnect') evenement natif de socket io qui permet de détecter si un user est deconnecté
socket.on('disconnect', () => {
    // socket.emit permet d'envoyer un donnée, alors que socket.on permet de recevoir
    socket.emit('disconnect')
});

// ('connect') evenement natif de socket io qui permet de détecter si un user est connecté
socket.on('connect', () => {
    console.log('=== demarrage du chat ===')
})

// ('message') evenement que j'ai crée, il permet d'envoyé des messages
socket.on('message', (data) => {
    console.log(data);
})

// repl permet de demarrer le chat dans un terminal
repl.start({
    prompt: '',
    eval: (cmd) => {
        socket.send(cmd)
    }
})