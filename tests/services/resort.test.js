const test = require('ava');
const MongodbMemoryServer = require('mongodb-memory-server').default;
const Mongoose = require('mongoose');
const Client = require('../../data/Client');
const Resort = require('../../data/Resort');
const ResortService = require('../../services/resort');

const mongod = new MongodbMemoryServer();

let _client;
let _resort;

test.before(async () => {

    const uri = await mongod.getConnectionString();

    await Mongoose.connect(uri, { useNewUrlParser : true });

});

test.beforeEach(async () => {

    _client = new Client({
        _id: new Mongoose.Types.ObjectId(),
        name: 'Test Client'
    });

    await _client.save();

    _resort = await ResortService.createResort(_client._id, 'Test Resort');

});

test.serial('create resort', async t => {

    const fetched = await Resort.findById(_resort._id);

    t.is(fetched.name, 'Test Resort');
    t.deepEqual(fetched.client, _client._id);

});

test.serial('create duplicate resort', async t => {

    const error = await t.throwsAsync(async () => {
        await ResortService.createResort(_client._id, 'Test Resort');
    }, Error)

    t.is(error.message, 'Test Resort already exists');

});

test.serial('delete resort', async t => {

    await ResortService.removeResort(_resort._id);

    const fetched = await Resort.findById(_resort._id);    

    t.is(fetched, null);

});

test.serial('get resort', async t => {

    const fetched = await ResortService.getResort(_resort._id);    

    t.deepEqual(fetched._id, _resort._id);

});

test.afterEach.always(async () => {
    await Resort.deleteMany();
    await Client.deleteMany();
});