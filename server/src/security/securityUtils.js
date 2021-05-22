const bcrypt = require('bcrypt');
const UserController = require('../sequelize/Controllers/UserController');

const encode = async (password) => {
    return await bcrypt.hashSync(password, +process.env.SALTROUNDS);
}

const compare = async (login, password) => {
  console.log("Login:", login);
    const user = await UserController.getByLogin(login);
    console.log("User:",user)
  return await bcrypt.compareSync(password, user[0]?.dataValues?.password);
};


module.exports = {
    encode,
    compare
}