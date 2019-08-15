const mongoose = require('mongoose');

let _connection;

module.exports = (function() {
    if (!_connection) {
        mongoose.connect('mongodb://localhost/rapport', {useNewUrlParser: true});
        _connection = mongoose;
    }
    return {
        db : mongoose.connection,
        mongoose
    };
}());