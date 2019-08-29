const Joi = require('@hapi/joi');
const Mongoose = require('mongoose');
const Bcrypt = require('bcryptjs');
const Jwt = require('jsonwebtoken');
const User = require('../data/User');
const Client = require('../data/Client');

// Validation
const registerSchema = {
    name: Joi.string().min(6).max(255).required(),
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(6).max(1024).required(),
    client: Joi.string().min(6).max(1024).required(),
};

const loginSchema = {
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(6).max(1024).required(),
};

module.exports = {

    async createUser(data) {

        const { error } = Joi.validate(data, registerSchema);

        if (error) {
            throw new Error(error);
        }

        const existingUser = await User.findOne({ email: data.email });

        if (existingUser) {
            throw new Error('Email has already been registerd');
        }

        const client = await Client.findById(data.client);

        if (!client) {
            throw new Error(`Could not find client ${data.client}`);
        }

        const salt = await Bcrypt.genSalt(10);

        data.password = await Bcrypt.hash(data.password, salt);
        data._id = new Mongoose.Types.ObjectId();

        const user = new User(data);

        user.save();

        client.users.push(user._id);

        await client.save();

        return user;

    },

    async login(data) {

        const { error } = Joi.validate(data, loginSchema);

        if (error) {
            throw new Error(error);
        }

        const user = await User.findOne({ email: data.email });

        if (!user) {
            throw new Error('Email or password is incorrect');
        }

        const isValidPassword = await Bcrypt.compare(data.password, user.password);

        if (!isValidPassword) {
            throw new Error('Email or password is incorrect');
        }

        const token = Jwt.sign({
            _id: user._id,
            client: user.client
        }, process.env.TOKEN_SECRET, { algorithm: 'HS256' });

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