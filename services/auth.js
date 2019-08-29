const Joi = require('@hapi/joi');
const Bcrypt = require('bcryptjs');
const Jwt = require('jsonwebtoken');
const User = require('../data/User');

// Validation
const registerSchema = {
    name: Joi.string().min(6).max(255).required(),
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(6).max(1024).required(),
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

        const salt = await Bcrypt.genSalt(10);
        data.password = await Bcrypt.hash(data.password, salt);

        const user = new User(data);

        user.save();

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