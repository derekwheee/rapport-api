const test = require('ava');
const proxyquire =  require('proxyquire');
const nodemailerMock = require('nodemailer-mock');
const EmailService = proxyquire('../../services/email', { 'nodemailer': nodemailerMock });

test.serial('send invite email', async t => {

    const to = 'test@example.com';
    const token = 'testtoken';

    await EmailService.sendUserInvite('Test Client', 'Test User', to, token);

    const email = nodemailerMock.mock.getSentMail();

    t.is(email.length, 1);
    t.deepEqual(email[0].to, to);
    t.true(email[0].html.includes(token));


});