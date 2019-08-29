const Mongoose = require('mongoose');
const Resort = require('../data/Resort');
const Client = require('../data/Client');

module.exports = {

    async createResort(clientId, name) {

        const client = Client.findById(clientId);

        const existingResort = await Resort.findOne({ name, client: clientId });

        if (existingResort) {
            throw new Error(`${name} already exists`);
        }

        const resort = new Resort({
            _id: new Mongoose.Types.ObjectId(),
            name,
            client: client._id
        });

        await resort.save();

        client.resorts.push(resort._id);

        await client.save();

        return resort;

    },

    async removeResort(resortId) {

        await Resort.deleteOne({ _id : resortId });

    },

    async getResort(resortId) {

        const resort = await Resort.findById(resortId);

        return resort;

    }

};