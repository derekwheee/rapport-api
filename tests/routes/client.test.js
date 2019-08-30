const test = require('ava');
const request = require('supertest');
const MongodbMemoryServer = require('mongodb-memory-server').default;
const mongoose = require('mongoose');

const bootstrap = require('../util/bootstrap');

const mongod = new MongodbMemoryServer();

let _app;
let _token;

test.before(async () => {

    const uri = await mongod.getConnectionString();

    await mongoose.connect(uri, { useNewUrlParser : true });

    _app = await bootstrap.getServerInstance();

    await bootstrap.createTestClient();

    _token = await bootstrap.getValidToken();


});

test.serial('unauthenticated request', async t => {

    const res = await request(_app.listener)
        .get('/api/client')
        .send();

    t.is(res.status, 401);

});

test.serial('get client', async t => {

    const res = await request(_app.listener)
        .get('/api/client')
        .set('Authorization', `Bearer ${_token}`)
        .send();

    t.is(res.status, 200);
    t.is(res.body.name, 'Test Client');

});

test.serial('get resorts', async t => {

    const res = await request(_app.listener)
        .get('/api/client/resorts')
        .set('Authorization', `Bearer ${_token}`)
        .send();

    t.is(res.status, 200);
    t.is(res.body.length, 1);
    t.is(res.body[0].name, 'Default Resort');

});

test.after.always(async () => {
    await bootstrap.cleanUp();
    await _app.stop();
});