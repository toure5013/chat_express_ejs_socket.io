// 'use strict'
const PORT = process.env.PORT || 8080;
const express = require('express');
const app = express(); //cette est pareil const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

//mysqlconfig file
const connection = require('./utils/mysqlconfig').connection;

//Middleware
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/PUBLIC'));

app.get("/", (req, res) => {
    res.render("index")
})



//Connect to database
connection.connect(function(err) {
    if (err) {
        console.error('error to connect to mysql server, verify that you have run your mysql server: ' + err.stack);
        return;
    }

    console.log("connected to mysql with success");
});


//Userlist
var users = [];
io.sockets.on('connection', (socket) => {

    console.log("User connected with socket id :  " + socket.id + ".......");

    //connect to incoming socket event
    socket.on('user_connected', function(user) {
        users[user.username] = socket.id;

        console.log(users[user.username]);
        //We'll use socket id to send message to individual user

        //notify all connected client
        //io.emit('user_connected', user.username);
        //Notify all connected client except connected client
        socket.broadcast.emit('user_connected', user.username)
    });

    //listen from client and send message
    socket.on('send_message', (data) => {
        //send to receiver
        var socketId = users[data.receiver];
        console.log(socketId);
        io.to(socketId).emit('new_message', data);
        var insertreq = "INSERT INTO messages(sender, receiver, message) VALUES (?,?,?)";
        var datatoinsert = [data.sender, data.receiver, data.message];
        connection.query(insertreq, datatoinsert, function(error, results, fields) {
            if (error) throw error;
            console.log("success " + results)
        });
    })


    //Socket deconnecter
    socket.on('disconnect', () => {
        console.log("User disconnected with socket id :  " + socket.id);
        io.emit('newUser', 'Un nouveau utilisateur s\'est déconnecter')
    })
})

http.listen(PORT, () => {
    console.log("Serveur run on http://localhost:" + PORT);
})