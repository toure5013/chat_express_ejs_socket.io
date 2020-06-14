const { JSON } = require("mysql/lib/protocol/constants/types");

module.exports.routesListe = (app, connection) => {
    /*------------------------------------------------------------
     -Web routes
     ------------------------------------------------------------*/

    app.get("/", (req, res) => {
        res.render("login-signup")
    })

    //Login
    app.get("/login", (req, res) => {
        res.render("login-signup");
    });

    app.post("/signup", (req, res) => {
        res.render("login-signup");
    });

    //chat
    app.get("/chat", (req, res) => {
        res.render("chat")
    });

    app.get("/groupe", (req, res) => {
        res.render("groupe")
    });

    app.get("/s", (req, res) => {
        res.render("search")
    });

    /*------------------------------------------------------------
     -api routes
     ------------------------------------------------------------*/
    app.post("/message_historique", (req, res) => {
        console.log(req.body)
        var body = req.body;
        var sender = body.sender;
        var receiver = body.receiver;
        //retourner l'historique des message
        var query = "SELECT * FROM `messages-groupe`";
        var params = [sender, receiver, receiver, sender]
        connection.query(query, params, (error, messages) => {
            if (error) {
                console.log(error)
                throw error;
            }
            //console.log(messages)
            // messages = messages.toString();
            // console.log(messages)
            res.json(messages);
        });
    });

    app.post("/auth", (req, res) => {

        console.log(req.body)
        var connectionReponse = {};

        //TO AUTH USER SEND PSEUDO AND PASSWORD
        if (req.body) {
            var body = req.body;
            var pseudo = body.pseudo;
            var password = body.password;
            var query = "SELECT * FROM `users` WHERE pseudo=? && password=?";
            var params = [pseudo, password];

            connection.query(query, params, (error, bdresponse) => {
                if (error) {
                    console.log(error)
                        // throw error;
                }
                var isconnected = bdresponse.length != 0;
                if (isconnected) {
                    connectionReponse = {
                        status: 200,
                        error: false,
                        success: true,
                        connected: true,
                        pseudo: pseudo,
                        message: "Connecté avec succès!"
                    }
                } else {
                    connectionReponse = {
                        status: 200,
                        error: false,
                        success: true,
                        connected: false,
                        pseudo: pseudo,
                        message: "Les données envoyés sont incorrects!"
                    }
                }
                res.json(connectionReponse)
            });
        } else {
            connectionReponse = {
                status: 200,
                error: true,
                success: false,
                connected: false,
                pseudo: pseudo,
                message: "Envoyer les données correct!"
            };
            res.json(connectionReponse)
        }


    });
}