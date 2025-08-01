const bcrypt = require('bcryptjs');

const hashpassword = (password) => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
}

const comparePassword = (password, hash) => {
  return bcrypt.compareSync(password, hash);
}

module.exports = {
  hashpassword,
  comparePassword
};