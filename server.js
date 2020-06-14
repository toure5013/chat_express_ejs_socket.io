// 'use strict'
const PORT = process.env.PORT || 8080;
const express = require('express');
const app = express(); //cette est pareil const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
var bodyParser = require('body-parser');
const path = require('path');
//mysqlconfig file
const connection = require('./utils/mysqlconfig').connection;


//Middleware
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/PUBLIC'));
const publicPathImageProfil = path.join(__dirname, '/PUBLIC/assets/images');

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
});
app.use(express.static(publicPathImageProfil));
//routes files 
const routes = require('./routes');




//Connect to database

try {
    connection.connect(function(err) {
        if (err) {
            console.error('error to connect to mysql server, verify that you have run your mysql server: ' + err.stack);
            return;
        }
        console.log("connected to mysql with success");
    });
} catch (error) {
    console.log('! ! ! ! ! !Veuillez lancer le serveur de ma bd !! ! !! ')
}


//Routes
routes.routesListe(app, connection);


//Userlist
var users = [];
io.sockets.on('connection', (socket) => {

    console.log("User connected with socket id :  " + socket.id + ".......");

    //connect to incoming socket event
    socket.on('user_connected', function(user) {
        users[user.username] = socket.id; //socket 

        console.log(users[user.username]);
        //We'll use socket id to send message to individual user

        //notify all connected client
        //io.emit('user_connected', user.username);
        //Notify all connected client except connected client
        socket.broadcast.emit('user_connected', user.username)
    });

    //listen from client (sender) and send message to receiver
    socket.on('send_message', (data) => {
        //send to receiver
        // var socketId = users[data.receiver];
        // console.log(socketId);
        socket.emit('new_message', data);
        // SELECT `id`, `pseudo`, `password`, `avatar`
        var insertreq = "INSERT INTO `messages-groupe`( `sender`, `message`) VALUES (?,?)";
        var datatoinsert = [data.sender, data.message];
        connection.query(insertreq, datatoinsert, function(error, results, fields) {
            if (error) throw error;
            socket.emit("monmsg", data); // envoi ceci à l'utilisateur
            socket.broadcast.emit("newmsgrecive", data); // envoi ceci à tout les autres
            console.log("success ");
            console.info(results);
        });
    })



    //Socket deconnecter
    socket.on('disconnect', () => {
        console.log("User disconnected with socket id :  " + socket.id);
        io.emit('newUser', 'Un nouveau utilisateur s\'est déconnecter')
    });
});

http.listen(PORT, () => {
    console.log("Serveur run on http://localhost:" + PORT);
});