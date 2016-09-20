console.log('app');
function load() {
    var socket = io('http://localhost:3001');
    socket.on('connect', function() {
        console.log('connected');
    });
    socket.on('message', function(data) {
        console.dir(arguments)
    });
    socket.on('disconnect', function() {
        console.log('disconnected');
    });
    socket.send('sub', {
        mid: 'movie',
        uid: 'users'
    })
    window.send = function() {
        console.log('send');
        socket.emit('login',{uid:'sankooc'});
    }
}
load();
