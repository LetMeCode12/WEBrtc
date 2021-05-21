const db = require("../index");
const User = db.db.users;
const Friend = db.db.friends;
const { v4 } = require("uuid");
const UserModel = require("../Models/UserModel");
//https://bezkoder.com/node-js-express-sequelize-mysql/
exports.create = (req, res) => {
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
  // Create a Tutorial
  const user = {
    id: v4(),
    login: req.body.login,
    password: req.body.password,
    name: req.body.name,
    surrname: req.body.surrname,
    email: req.body.email,
    Friends: [
      { id: v4(), friend: v4() },
      { id: v4(), friend: v4() },
    ],
  };

  User.create(user, { include: Friend })
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
  const id = req.params.id
  // User.update({Friends:})
};

exports.getAll = (req, res) => {
  User.findAll({ include: [{ model: Friend }] })
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials.",
      });
    });
};
