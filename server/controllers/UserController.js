const { comparePassword } = require('../helpers/bcrypt');
const { signToken } = require('../helpers/jwt');
const { User } = require('../models');
const { OAuth2Client } = require('google-auth-library');

class UserController {
    static async register(req, res, next) {
        // Registration logic
        try {
            const { fullname, email, password, role } = req.body;

            const user = await User.create({
                fullname, email, password, role: role || 'user'
            });

            res.status(201).json({
                fullname: user.fullname,
                email: user.email,
                role: user.role
            });

        } catch (error) {
            next(error);
        }
    }

    static async login(req, res, next) {
        // Login logic
        try {
            const { email, password } = req.body;

            if (!email) {
                throw { name: 'BadRequest', message: 'Email is required' };
            }

            if (!password) {
                throw { name: 'BadRequest', message: 'Password is required' };
            }

            const user = await User.findOne({ where: { email } });

            if (!user) {
                throw { name: 'Unauthorized', message: 'Invalid email or password' };
            }

            const checkPassword = comparePassword(password, user.password);

            if (!checkPassword) {
                throw { name: "Unauthorized", message: 'Invalid email or password' };
            }

            const access_token = signToken({
                id: user.id,
                email: user.email,
                role: user.role
            });

            res.status(200).json({ 
                access_token, 
                user: {
                    id: user.id,
                    fullname: user.fullname,
                    email: user.email,
                    role: user.role
                }
            });
        } catch (error) {
            next(error);
        }
    }

    static async googleLogin(req, res, next) {
        try {
            const { googleToken } = req.body
            if (!googleToken) throw { name: "BadRequest", message: "Google Token is required" }


            // Create instance of OAuth2Client
            const client = new OAuth2Client();

            // Verify the token
            // Note: You need to set your Google Client ID in the environment variable GOOGLE_CLIENT_ID
            const ticket = await client.verifyIdToken({
                idToken: googleToken,
                audience: process.env.GOOGLE_CLIENT_ID
            })

            // Get the user information from the token
            const payload = ticket.getPayload()
            console.log(payload, "<<<");


            // bikin user if not exists karena untuk bikin token kita butuh user id
            const randomPassword = payload.sub + Date.now().toString() + Math.random().toString(36).substring(2, 15) // generate a random password
            const [user, created] = await User.findOrCreate({
                where: { email: payload.email },
                defaults: {
                    email: payload.email,
                    fullname: payload.name,
                    password: randomPassword,
                    role: 'user'
                }
            })

            const access_token = signToken({
                id: user.id,
                email: user.email,
                role: user.role
            });

            res.status(created ? 201 : 200).json({
                access_token,
                role: user.role,
                fullname: user.fullname
            });
        } catch (error) {
            next(error)
        }
    }
}

module.exports = UserController