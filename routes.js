module.exports = function(server) {
    server.route({
        method: '*',
        path: '/{any*}',
        handler: (req, h) => {
            return '404 Error! Page Not Found!';
        }
    });

    server.route({
        method: 'GET',
        path: '/api/public',
        config: {
            auth: false,
                handler: (req, h) => {
                return 'Hello from a public endpoint! You don\'t need to be authenticated to see this.';
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/api/private',
        config: {
            auth: 'jwt',
            handler: (req, h) => {
                return 'Hello from a private endpoint! You need to be authenticated to see this.'
            }
        }
    });
}