'use strict';

const Hapi = require('@hapi/hapi');
const jwt = require('hapi-auth-jwt2');
const jwksRsa = require('jwks-rsa');
const registerRoutes = require('./routes');

const init = async () => {
    const server = new Hapi.server({
        port: 3000,
        host: 'localhost'
    });

    const validateUser = (decoded, request, callback) => {
        // This is a simple check that the `sub` claim
        // exists in the access token. Modify it to suit
        // the needs of your application
        if (decoded && decoded.sub) {
            if (decoded.scope) {
                return callback(null, true, {
                    scope: decoded.scope.split(' ')
                });
            }
      
            return callback(null, true);
        }
      
        return callback(null, false);
    };
    
    await server.register(jwt);

    server.auth.strategy('jwt', 'jwt', {
        complete: true,
        // verify the access token against the
        // remote Auth0 JWKS
        key: jwksRsa.hapiJwt2Key({
            cache: true,
            rateLimit: true,
            jwksRequestsPerMinute: 5,
            jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
        }),
        verifyOptions: {
            audience: process.env.AUTH0_AUDIENCE,
            issuer: `https://${process.env.AUTH0_DOMAIN}/`,
            algorithms: ['RS256']
        },
        validate: validateUser
    });

    registerRoutes(server);

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();