const { mongoose } = require('../context');
const { Schema, model } = mongoose;

const ResortSchema = new Schema({
    _id: Schema.Types.ObjectId,
    name: String,
    client: { type: Schema.Types.ObjectId, ref: 'Client' }
});

const Resort = model('Resort', ResortSchema);

module.exports = Resort;