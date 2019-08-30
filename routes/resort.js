const Boom = require('@hapi/boom');
const ResortService = require('../services/resort');

const baseRoute = '/api/resort';

module.exports = [
    {
        path: `${baseRoute}/`,
        method: 'GET',
        config: {
            auth: 'jwt',
            handler: async (req, h) => {

                try {
                    return await ResortService.getResort(req.payload.resortId);
                } catch (err) {
                    return Boom.badImplementation('Something went wrong');
                }

            }
        }
    },
    {
        path: `${baseRoute}/`,
        method: 'POST',
        config: {
            auth: 'jwt',
            handler: async (req, h) => {

                try {
                    return await ResortService.createResort(req.payload);
                } catch (err) {
                    return Boom.badImplementation('Something went wrong');
                }

            }
        }
    },
];