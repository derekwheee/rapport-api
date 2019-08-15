const mongoose = require('mongoose');
let _connection;

require('dotenv').config();

module.exports = (function() {
    if (!_connection) {
        mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true});
        _connection = mongoose;
    }
    return {
        db : mongoose.connection,
        mongoose
    };
}());