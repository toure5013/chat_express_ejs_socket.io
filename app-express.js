// 'use strict'
const PORT = 8080;
const express = require('express');
const app = express(); //cette est pareil const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/PUBLIC'));

app.get("/", (req, res) => {
    res.render("index")
})


io.sockets.on('connection', (socket) => {

    console.log("connecter ......")

    var messageEnvoyer = ""
        //Mon evènement
    socket.on('message', (mesgRcu) => {
        console.log(messageEnvoyer);
        messageEnvoyer = mesgRcu;
        //io.emit("newmsgrecive", messageEnvoyer)
        socket.broadcast.emit("newmsgrecive", messageEnvoyer);
    });


    //faire un bodcast à tout les client
    socket.broadcast.emit('newUser', 'Un nouveau utilisateur vient de se connecter')
        //Socket deconnecter
    socket.on('disconnect', () => {
        console.log("bye bye");
        io.emit('newUser', 'Un nouveau utilisateur s\'est déconnecter')
    })
})

http.listen(PORT, () => {
    console.log("Serveur run on http://localhost:" + PORT);
})