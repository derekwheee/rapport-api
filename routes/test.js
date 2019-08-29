const Boom = require('@hapi/boom');

module.exports = [
    {
        path: '/api/test',
        method: 'GET',
        config: {
            auth: 'jwt',
            handler: (req, h) => {
                return 'Hello from a private endpoint!';
            }
        }
    },
]