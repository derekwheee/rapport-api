const { mongoose } = require('../context');
const { Schema, model } = mongoose;

const ClientSchema = new Schema({
    _id: Schema.Types.ObjectId,
    name: String,
    resorts: [{ type: Schema.Types.ObjectId, ref: 'Resort' }]
});

const Client = model('Client', ClientSchema);

module.exports = Client;