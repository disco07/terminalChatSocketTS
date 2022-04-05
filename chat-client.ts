const socket = require('socket.io-client')('http://localhost:3000');
const repl = require('repl')
const chalk = require('chalk');
socket.on('disconnect', function() {
    socket.emit('disconnect')
});
socket.on('connect', () => {
    console.log(chalk.red('=== start chatting ==='))
})
socket.on('message', (data: { cmd: any; username: any; }) => {
    const { cmd, username } = data
    console.log(chalk.green(username + ': ' + cmd.split('\n')[0]));
})
repl.start({
    prompt: '',
    eval: (cmd) => {
        socket.send(cmd)
    }
})