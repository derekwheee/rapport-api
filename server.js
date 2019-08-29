'use strict';

const Hapi = require('@hapi/hapi');
const jwt = require('hapi-auth-jwt2');
const bootstrap = require('./bootstrap');
const registerRoutes = require('./routes');
const AuthService = require('./services/auth');

require('dotenv').config();

const init = async () => {

    await bootstrap();

    const server = new Hapi.server({
        port: process.env.PORT || 3001,
    });

    await server.register({
        plugin: require('hapi-cors'),
    });

    await server.register(jwt);

    await server.auth.strategy('jwt', 'jwt', {
        key: process.env.TOKEN_SECRET,
        validate: AuthService.validateToken,
        verifyOptions: { algorithms: ['HS256'] }
    });

    server.auth.default('jwt');

    await server.register({
        plugin: require('hapi-router'),
        options: {
            routes: 'routes/*.js'
        }
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();