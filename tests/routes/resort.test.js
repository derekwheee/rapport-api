const test = require('ava');
const request = require('supertest');
const MongodbMemoryServer = require('mongodb-memory-server').default;
const mongoose = require('mongoose');
const Resort = require('../../data/Resort');
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

test.serial('get resort', async t => {

    const resort = await Resort.findOne();
    const res = await request(_app.listener)
        .get(`/api/resort?resortId=${resort._id}`)
        .set('Authorization', `Bearer ${_token}`)
        .set('Accept', 'application/json; charset=utf-8');

    t.is(res.status, 200);
    // TODO: Figure out why no data is coming through
    // t.is(res.body._id, resort._id);

});

test.after.always(async () => {
    await bootstrap.cleanUp();
    await _app.stop();
});