const { db } = require('./context');
const seed = require('./seed');

module.exports = async function() {
    return new Promise(async (resolve, reject) => {
        db.on('error', console.error.bind(console, 'connection error:'));
        db.once('open', async () => {
            console.log('Connected to database');
            await seed();
            resolve(db);
        });
    });
}