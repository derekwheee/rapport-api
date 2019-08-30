const test = require('ava');
const request = require('supertest');
const MongodbMemoryServer = require('mongodb-memory-server').default;
const mongoose = require('mongoose');
const Bcrypt = require('bcryptjs');

const server = require('../server');
const User = require('../data/User');

const testEmail = 'one@example.com';
const testPassword = 'test123';
let app;

const mongod = new MongodbMemoryServer();

test.before(async () => {

    const uri = await mongod.getConnectionString();

    await mongoose.connect(uri, { useNewUrlParser : true });

    app = await server();

});

test.beforeEach(async () => {

    // Hash test password for comparison
    const salt = await Bcrypt.genSalt(10);
    const hashedPassword = await Bcrypt.hash(testPassword, salt);

    // Create test user
    const user = new User({
        name: 'Test User',
        email: testEmail,
        password: hashedPassword
    });

    await user.save();

});

test.serial('log in', async t => {

    const res = await request(app.listener)
        .post('/token')
        .send({ email: testEmail, password: testPassword });

    t.is(res.status, 200);
    t.truthy(res.text);

});

test.afterEach.always(() => User.remove());