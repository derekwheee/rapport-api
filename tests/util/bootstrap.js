const AuthService = require('../../services/auth');
const User = require('../../data/User');
const Client = require('../../data/Client');
const Resort = require('../../data/Resort');
const server = require('../../server');

const testCredentials = {
    name: 'Test User',
    email: 'test@test.com',
    password: 'test123',
    clientName: 'Test Client'
};

let _server;

module.exports = {

    async getServerInstance() {

        if (_server) return _server;

        try {
            _server = await server();
        } catch {
            // Server is already running on port 3001
            // Start another on random port number
            _server = await server(Math.round(Math.random() * (9999 - 3002)) + 3002);
        }

        return _server;

    },

    async createTestClient() {

        return await AuthService.registerClient(testCredentials);

    },

    async getValidToken() {

        return await AuthService.login(testCredentials);

    },

    async cleanUp() {

        await User.deleteMany();
        await Resort.deleteMany();
        await Client.deleteMany();

    }

};