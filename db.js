const Sequelize = require('sequelize');

let _connection;

modulue.exports = (function() {
    if (!_connection) {
        _connection = new Sequelize('postgres://postgres:admin123!@localhost:5432/Rapport')
    }
    return _connection;
}());