const test = require('ava');
const MongodbMemoryServer = require('mongodb-memory-server').default;
const Mongoose = require('mongoose');
const Client = require('../../data/Client');
const Resort = require('../../data/Resort');
const ClientService = require('../../services/client');

const mongod = new MongodbMemoryServer();

let _client;

test.before(async () => {

    const uri = await mongod.getConnectionString();

    await Mongoose.connect(uri, { useNewUrlParser : true });

});

test.beforeEach(async () => {

    _client = await ClientService.createClient('Test Client');

});

test.serial('create client', async t => {

    const fetched = await Client.findById(_client._id);

    t.is(fetched.name, 'Test Client');
    t.is(fetched.resorts.length, 1);
    t.deepEqual(fetched._id, _client._id);

});

test.serial('create duplicate client', async t => {

    const error = await t.throwsAsync(async () => {
        await ClientService.createClient('Test Client');
    }, Error)

    t.is(error.message, 'Client name is already taken');

});

test.serial('delete client', async t => {

    await ClientService.removeClient(_client._id);

    const fetched = await Client.findById(_client._id);    

    t.is(fetched, null);

});

test.serial('get client', async t => {

    const fetched = await ClientService.getClient(_client._id);    

    t.deepEqual(fetched._id, _client._id);

});

test.serial('get resorts', async t => {

    const resorts = await ClientService.getResorts(_client._id);    

    t.is(resorts.length, 1);

});

test.afterEach.always(async () => {
    await Resort.deleteMany();
    await Client.deleteMany();
});