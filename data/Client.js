const { Schema, model } = require('mongoose');

const ClientSchema = new Schema({
    _id: Schema.Types.ObjectId,
    name: String,
    resorts: [{ type: Schema.Types.ObjectId, ref: 'Resort' }],
    users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    date: {
        type: Date,
        default: Date.now
    },
});

const Client = model('Client', ClientSchema);

module.exports = Client;
