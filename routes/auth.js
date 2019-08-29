const Boom = require('@hapi/boom');
const AuthService = require('../services/auth');

module.exports = [
    {
        path: '/register',
        method: 'POST',
        config: {
            auth: false,
            handler: async (req, h) => {

                try {
                    const user = await AuthService.registerClient(req.payload);
                    return {
                        user: user._id
                    };
                } catch (err) {
                    return Boom.badRequest(err);
                }

            }
        }
    },
    {
        path: '/token',
        method: 'POST',
        config: {
            auth: false,
            handler: async (req, h) => {

                try {
                    return await AuthService.login(req.payload);
                } catch (err) {
                    return Boom.badRequest(err);
                }

            }
        }
    },
];