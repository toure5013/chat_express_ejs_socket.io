var mysql = require('mysql');

try {
    module.exports.connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'web-chat'
    });
} catch (error) {
    console.log('! ! ! ! ! !Veuillez lancer le serveur de ma bd !! ! !! ')
}