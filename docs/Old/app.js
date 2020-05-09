// 'use strict'
const http = require('http');
const fs = require('fs');
const PORT = 8080;

//Chargement du fichier index.html
var server = http.createServer(function(req, res) {
    fs.readFile('./index.html', 'utf-8', function(error, content) {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(content);
    });
});

//Chargement de socket.io
var io = require('socket.io').listen(server);

//Quand un client se connecte , on le note dans la console
io.sockets.on('connection', function(socket) {
    /*
        ------Pour gerer un envoi d'evenement on fait  : 
                    socket.emit('typemessage', 'message a envoyer')
        ------Pour une reception
                    socket.on('typemessage', function(){
                        //Instructions ç effectuer;
                    })

    */
    console.log('Un client est connecté');
    //console.log(socket);
    socket.emit('message', { content: 'Vous êtes bien connecté', importance: 1 });
    socket.on('message', function(message) {
        console.log(message);
    });
});

server.listen(PORT)