const { db } = require('./context');
const Seed = require('./seed');

module.exports = function () {

    return new Promise((resolve, reject) => {

        db.on('error', console.error.bind(console, 'connection error:'));

        db.once('open', async () => {

            console.log('Connected to database');
            await Seed();
            resolve(db);

        });

    });

};
