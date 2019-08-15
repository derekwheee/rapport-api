const { mongoose } = require('./context');
const Client = require('./data/Client');
const Resort = require('./data/Resort');

async function getExisting() {

    return {
        Client : await Client.findOne({}),
        Resort : await Resort.findOne({}),
    }
}

module.exports = async function () {
    const existing = await getExisting();

    if (!existing.Client) {
        console.log('Seeding Test Client');

        const seedClient = new Client({
            _id: new mongoose.Types.ObjectId(),
            name: 'Test Client'
        });

        await seedClient.save();

        existing.Client = seedClient;
    }

    if (!existing.Resort) {
        console.log('Seeding Test Resort');

        const seedResort = new Resort({
            _id: new mongoose.Types.ObjectId(),
            name: 'Test Resort',
            client: existing.Client._id
        });

        await seedResort.save();

        existing.Resort = seedResort;

        existing.Client.resorts.push(seedResort._id);

        await existing.Client.save();
    }
}