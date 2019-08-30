const { db } = require('./context');

module.exports = function () {

    return new Promise((resolve, reject) => {

        db.on('error', console.error.bind(console, 'connection error:'));

        db.once('open', () => {

            console.log('Connected to database');
            resolve(db);

        });

    });

};
