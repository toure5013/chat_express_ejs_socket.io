// 'use strict'
const PORT = process.env.PORT || 8080;
const express = require('express');
const app = express(); //cette est pareil const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

//mysqlconfig file
const connection = require('./utils/mysqlconfig').connection;

//routes files 
const routes = require('./routes');
//Middleware
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/PUBLIC'));


//Routes
routes.routesListe(app, connection);


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
        console.log("User connected with socket id :  " + socket.id);

    });


    //chatbot test -----
    socket.on('newmsg', (message) => {
        console.log(message);
        //appellé le moteur d'intélligence et renvoyer la reponse à l'uilisateur seul
        var botMessage = "cc je suis le message venant du bot";
        var data = {
            user: message.message,
            bot: botMessage
        };

        //This two code in bottom made the same think
        //Thirst (too long) 
        var socketId = socket.id;
        io.to(socketId).emit('botMessage', data); //envoyer le message uniquement à celui qui à envoyer le message

        //Second method (easy)
        socket.emit('botMessage', data);
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