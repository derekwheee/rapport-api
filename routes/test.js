const Boom = require('@hapi/boom');

module.exports = [
    {
        path: '/api/test',
        method: 'GET',
        config: {
            auth: 'jwt',
            handler: (req, h) => {

                try {
                    return 'Hello from a private endpoint!';
                } catch (err) {
                    return Boom.badImplementation('Something went wrong');
                }

            }
        }
    },
];