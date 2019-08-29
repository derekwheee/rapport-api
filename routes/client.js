const Boom = require('@hapi/boom');
const ClientService = require('../services/client');

const baseRoute = '/api/client';

module.exports = [
    {
        path: `${baseRoute}/`,
        method: 'GET',
        config: {
            auth: 'jwt',
            handler: async (req, h) => {

                try {
                    return await ClientService.getClient(req.auth.credentials.client);
                } catch (err) {
                    return Boom.badImplementation('Something went wrong');
                }

            }
        }
    },
    {
        path: `${baseRoute}/resorts`,
        method: 'GET',
        config: {
            auth: 'jwt',
            handler: async (req, h) => {

                try {
                    return await ClientService.getResorts(req.auth.credentials.client);
                } catch (err) {
                    return Boom.badImplementation('Something went wrong');
                }

            }
        }
    },
];