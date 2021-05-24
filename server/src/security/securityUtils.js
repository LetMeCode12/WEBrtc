const bcrypt = require("bcrypt");
const UserController = require("../sequelize/Controllers/UserController");

const encode = async (password) => {
  return await bcrypt.hashSync(password, +process.env.SALTROUNDS);
};

const compare = async (login, password, res) => {
  const user = await UserController.getByLogin(login);
  if (user.length <= 0) return res.status(403).send();
  return await bcrypt.compareSync(password, user[0]?.dataValues?.password);
};

module.exports = {
  encode,
  compare,
};
