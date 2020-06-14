var host = "u3r5w4ayhxzdrw87.cbetxkdyhwsb.us-east-1.rds.amazonaws.com";
var Username = "qc0ayatuu6p0zwzx";
var Password = "pvcqunfw6v7nqblh";
var Port = 3306;
var Database = "r4dc30b9j693ycri";

var mysql = require('mysql');

try {
    module.exports.connection = mysql.createConnection({
        host: host,
        port: Port,
        user: Username,
        password: Password,
        database: Database
    });
    // console.log(this.connection)
} catch (error) {
    console.log('! ! ! ! ! !Veuillez lancer le serveur de ma bd !! ! !! ')
}