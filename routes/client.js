const Boom = require('@hapi/boom');
const ClientService = require('../services/client');
const AuthService = require('../services/auth');

const baseRoute = '/api/client';

module.exports = [
    {
        path: `${baseRoute}`,
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
    {
        path: `${baseRoute}/adduser`,
        method: 'POST',
        config: {
            auth: 'jwt',
            handler: async (req, h) => {

                try {
                    await AuthService.inviteUser(req.auth.credentials.client, req.payload.name, req.payload.email, req.payload.force);
                    return `Invite sent to ${req.payload.email}`;
                } catch (err) {
                    return Boom.badImplementation('Something went wrong');
                }

            }
        }
    },
];