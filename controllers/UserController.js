const { comparePassword } = require('../helpers/bcrypt');
const { signToken } = require('../helpers/jwt');
const { User } = require('../models');


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
                throw { name: 'ValidationError', message: 'Email is required' };
            }

            if (!password) {
                throw { name: 'ValidationError', message: 'Password is required' };
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

            res.status(200).json({ access_token, role: user.role });
        } catch (error) {
            console.log(error, "<<<");

            next(error);
        }
    }
}

module.exports = UserController