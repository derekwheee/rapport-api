const Joi = require('@hapi/joi');
const Mongoose = require('mongoose');
const Bcrypt = require('bcryptjs');
const Jwt = require('jsonwebtoken');
const PasswordGenerator = require('generate-password');
const User = require('../data/User');
const ClientService = require('../services/client');
const EmailService = require('../services/email');

// Validation
const clientSchema = {
    name: Joi.string().min(6).max(255).required(),
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(6).max(1024).required(),
    clientName: Joi.string().min(4).max(1024).required(),
};

const userSchema = {
    name: Joi.string().min(6).max(255).required(),
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(6).max(1024).required(),
};

const inviteSchema = {
    name: Joi.string().min(6).max(255).required(),
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(6).max(1024).required(),
};

const loginSchema = {
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(6).max(1024).required(),
};

module.exports = {

    async registerClient(data) {

        const { error } = Joi.validate(data, clientSchema);

        if (error) {
            throw new Error(error);
        }

        const client = await ClientService.createClient(data.clientName);

        const salt = await Bcrypt.genSalt(10);
        const hashedPassword = await Bcrypt.hash(data.password, salt);

        const user = new User({
            _id: new Mongoose.Types.ObjectId(),
            name: data.name,
            email: data.email,
            password: hashedPassword,
            client: client._id
        });

        user.save();

        client.users.push(user._id);

        await client.save();

        return user;

    },

    async registerUser(clientId, name, email, password) {

        const { error } = Joi.validate({ email, name, password }, userSchema);

        if (error) {
            throw new Error(error);
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            throw new Error(`${email} is already registered`);
        }

        const client = await ClientService.getClient(clientId);
        const salt = await Bcrypt.genSalt(10);
        const hashedPassword = await Bcrypt.hash(password, salt);

        const user = new User({
            _id: new Mongoose.Types.ObjectId(),
            name,
            email,
            password: hashedPassword,
            client: client._id
        });

        user.save();

        client.users.push(user._id);

        await client.save();

        return user;

    },

    async login({ email, password }) {

        const { error } = Joi.validate({ email, password }, loginSchema);

        if (error) {
            throw new Error(error);
        }

        const user = await User.findOne({ email });

        if (!user) {
            throw new Error('Email* or password is incorrect');
        }

        const isValidPassword = await Bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            throw new Error('Email or password* is incorrect');
        }

        const token = Jwt.sign({
            _id: user._id,
            client: user.client
        }, process.env.TOKEN_SECRET, { algorithm: 'HS256' });

        return token;

    },

    async inviteUser(clientId, name, email, force) {

        const { error } = Joi.validate({ name, email }, inviteSchema);

        if (error) {
            throw new Error(error);
        }

        const existingUser = await User.findOne({ email });

        if (existingUser && force) {
            // TODO: Delete existing user and continue
            // For use with "Resend invite"
        } else if (existingUser && !force) {
            throw new Error(`${email} is already registered`);
        }

        const user = await this.registerUser(clientId, name, email, PasswordGenerator.generate({
            length: 10,
            numbers: true
        }));

        const token = Jwt.sign({
            _id: user._id,
            client: user.client
        }, process.env.TOKEN_SECRET, { algorithm: 'HS256' });

        // TODO: Delete user if email cannot be sent
        await EmailService.sendUserInvite(clientId, name, email, token);

        return token;

    },

    validateToken(token, request) {

        if (!token) {
            return { isValid: false };
        }

        try {
            const verified = Jwt.verify(request.auth.token, process.env.TOKEN_SECRET, { algorithm: 'HS256' });
            return verified ? { isValid: true } : { isValid : false };
        } catch (err) {
            return { isValid: false };
        }

    }

};