const roleRedirect = (req, res, next) => {
    try {
        const { role } = req.user; // Assuming req.user contains user data after authentication

        if (role === 'admin') {
            return res.redirect('/cms'); // Redirect to CMS page
        } else if (role === 'user') {
            return res.redirect('/public'); // Redirect to public page
        } else {
            throw { name: 'Unauthorized', message: 'Role not recognized' };
        }
    } catch (error) {
        next(error);
    }
};

module.exports = roleRedirect;
