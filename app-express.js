// 'use strict'
const PORT = 8080;
const express = require('express');
const app = express(); //cette est pareil const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/PUBLIC'));

app.get("/", (req, res) => {
    res.render("groupe")
})


io.sockets.on('connection', (socket) => {

    console.log("User connected with socket id :  " + socket.id);


    //faire un bodcast à tout les client
    socket.broadcast.emit('newUser', 'Un nouveau utilisateur vient de se connecter')

    //console.log(socket.id);

    var messageEnvoyer = ""
        //Mon evènement
    socket.on('message', (mesgRcu) => {
        console.log(messageEnvoyer);
        messageEnvoyer = mesgRcu;
        //io.emit("newmsgrecive", messageEnvoyer) // A tout le monde l'envoyeur compris
        socket.emit("monmsg", messageEnvoyer); // envoi ceci à l'utilisateur
        socket.broadcast.emit("newmsgrecive", messageEnvoyer); // envoi ceci à tout les autres
    });


    //Socket deconnecter
    socket.on('disconnect', () => {
        console.log("User disconnected with socket id :  " + socket.id);
        io.emit('newUser', 'Un nouveau utilisateur s\'est déconnecter')
    })
})

http.listen(PORT, () => {
    console.log("Serveur run on http://localhost:" + PORT);
})