const db = require("../index");
const User = db.db.users;
const Friend = db.db.friends;
const { v4 } = require("uuid");
const { encode } = require("../../security/securityUtils");
//https://bezkoder.com/node-js-express-sequelize-mysql/
exports.create = async (req, res) => {
  const requiredFields = ["login", "password", "name", "surrname", "email"];

  if (
    req.body &&
    Object.keys(req.body)
      .sort((a, b) => a - b)
      .toString() !== requiredFields.sort((a, b) => a - b).toString()
  ) {
    res.status(400).send("Wrong input data");
    return;
  }
  const user = {
    id: v4(),
    login: req.body.login,
    password: await encode(req.body.password),
    name: req.body.name,
    surrname: req.body.surrname,
    email: req.body.email,
  };

  User.create(user)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the User.",
      });
    });
};

exports.addFriend = (req, res) => {
  const id = req.params.id;
  // User.update({include:Friends})
};

exports.getAll = (req, res) => {
  User.findAll({ include: [{ model: Friend }] })
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred",
      });
    });
};

exports.getByLogin = async (login) => {
  return await User.findAll({
    where: { login: login },
    include: [{ model: Friend }],
    attributes: ["id","login","name",'password'],
  });
};

exports.getById = async (id) => {
  return await User.findAll({
    where: { id: id },
    attributes: ["id", "login", "name"],
  });
};
