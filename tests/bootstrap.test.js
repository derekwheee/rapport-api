const test = require('ava');
const Bootstrap = require('../Bootstrap');

test('database state', async t => {

    const db = await Bootstrap();

    t.true('readyState' in db);
    t.is(db.readyState, 1);

    db.close();

    // Takes a bit of time for the connection to close
    t.is(db.readyState, 3);

});