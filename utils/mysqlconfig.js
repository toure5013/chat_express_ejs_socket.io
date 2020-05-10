var mysql = require('mysql');
4

module.exports.connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'web-chat'
});