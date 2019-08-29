const Mongoose = require('mongoose');

let _connection;

require('dotenv').config();

module.exports = (function () {

    if (!_connection) {
        Mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });
        _connection = Mongoose;
    }

    return {
        db : _connection.connection,
        Mongoose : _connection
    };

}());
