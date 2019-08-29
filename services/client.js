const Client = require('../data/Client');

module.exports = {

    async getClient(clientId) {

        const client = await Client.findById(clientId).populate('resorts');

        return client;

    },

    async getResorts(clientId) {

        const client = await Client.findById(clientId).populate('resorts');

        return client.resorts;

    }

};