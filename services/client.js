const Client = require('../data/Client');
const ResortService = require('./resort');

module.exports = {

    async createClient(name) {

        const existingClient = await Client.findOne({ name });

        if (existingClient) {
            throw new Error(`Client name is already taken`);
        }

        const client = new Client({
            name
        });

        await client.save();

        await ResortService.createResort(client._id, 'Default Resort');

        return client;

    },

    async removeClient(clientId) {

        await Client.deleteOne({ _id : clientId });

    },

    async getClient(clientId) {

        const client = await Client.findById(clientId).populate('resorts');

        return client;

    },

    async getResorts(clientId) {

        const client = await Client.findById(clientId).populate('resorts');

        return client.resorts;

    },

};