module.exports.routesListe = (app, connection) => {
    /*------------------------------------------------------------
     -Web routes
     ------------------------------------------------------------*/
    app.get("/", (req, res) => {
        res.render("index")
    })


    /*------------------------------------------------------------
     -api routes
     ------------------------------------------------------------*/
    app.post("/message_historique", (req, res) => {
        console.log(req.body)
        var body = req.body;
        var sender = body.sender;
        var receiver = body.receiver;
        //retourner l'historique des message
        var selectmessagerequest = "SELECT * FROM `messages` WHERE `sender`= ? && `receiver` = ? OR `sender`= ? && `receiver` = ?";
        var params = [sender, receiver, receiver, sender]
        connection.query(selectmessagerequest, params, (error, messages) => {
            if (error) {
                console.log(error)
                throw error;
            }
            //console.log(messages)
            res.end(JSON.stringify(messages));
        });
    })
}