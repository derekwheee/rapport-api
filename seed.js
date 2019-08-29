const Mongoose = require('mongoose');
const Client = require('./data/Client');
const Resort = require('./data/Resort');

const getExisting = async function () {

    return {
        Client : await Client.findOne({}),
        Resort : await Resort.findOne({}),
    };

};

module.exports = async function () {

    const existing = await getExisting();

    if (!existing.Client) {
        console.log('Seeding Test Client');

        const seedClient = new Client({
            _id: new Mongoose.Types.ObjectId(),
            name: 'Test Client'
        });

        await seedClient.save();

        existing.Client = seedClient;
    }

    if (!existing.Resort) {
        console.log('Seeding Test Resort');

        const seedResort = new Resort({
            _id: new Mongoose.Types.ObjectId(),
            name: 'Test Resort',
            client: existing.Client._id
        });

        await seedResort.save();

        existing.Resort = seedResort;

        existing.Client.resorts.push(seedResort._id);

        await existing.Client.save();
    }

};