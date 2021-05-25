const UserController = require("./sequelize/Controllers/UserController");
const multer = require("multer")();
const fs = require("fs");
const { authenticationToken } = require("./security/jwt");

const restApi = (app) => {
  app.get("/", authenticationToken, async (req, res) => {
    const { user } = req;
    const _user = await UserController.getByLogin(user.username);
    res.json({ user: { ..._user[0].dataValues, Friends:_user[0].dataValues.Friends.map(e=>e.friend),password:undefined  }});
  });

  app.post("/findById", authenticationToken, async (req, res) => {
    const { id } = req.body;
    if (!id || id?.length <= 0) return res.status(400).send("Login is empty");
    const users = await UserController.getById(id);
    res.json({ users: users });
  });

  app.get("/users",authenticationToken, UserController.getAll);

  app.post("/user/register", UserController.create);

  app.post("/user/image/save", multer.single("photo"), (req, res) => {
    if (req.body && req.file) {
      if (!["jpg", "png"].includes(req.file.originalname.split(".")[1])) {
        return res.status(500).send("Wrong type file");
      }
      fs.writeFile(
        __dirname +
          "/files/avatars/" +
          req.body.userId +
          "." +
          req.file.originalname.split(".")[1],
        req.file.buffer,
        (err) => {
          if (err) {
            return res.status(500).send();
          }
        }
      );
      return res.status(200).send();
    }
    res.status(500).send();
  });
};

module.exports = {
  restApi,
};
