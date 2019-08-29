const Bootstrap = require('./bootstrap');
const Server = require('./server');

(async function () {
    // Create database connection, etc
    await Bootstrap();

    // Start the server
    Server();
}());