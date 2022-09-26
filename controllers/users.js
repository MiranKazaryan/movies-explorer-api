const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const BAD_REQUEST = require("../errors/BadRequesError");
const NOT_FOUND = require("../errors/NotFoundError");
const CONFLICT_ERROR = require("../errors/ConflictError");

const { NODE_ENV, JWT_SECRET } = process.env;

const createUser = (req, res, next) => {
  const { name, email, password } = req.body;
  console.log(req.body);
  bcrypt
    .hash(password, 10)
    .then((hash) =>
      User.create({
        name,
        email,
        password: hash,
      })
    )
    .then((user) => {
      res.status(201).send(user.deletePasswordFromUser());
    })
    .catch((e) => {
      if (e.name === "ValidationError") {
        next(new BAD_REQUEST("Error validating user"));
      } else if (e.code === 11000) {
        next(new CONFLICT_ERROR("This email is already exist"));
      } else {
        next(e);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === "production" ? JWT_SECRET : "dev-secret",
        {
          expiresIn: "7d",
        }
      );
      res.send({ token });
    })
    .catch(next);
};

const getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw new NOT_FOUND("User is not found");
    })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch(next);
};

// обновление данных профиля
const updateProfile = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        throw new NOT_FOUND("User is not found");
      } else {
        res.status(200).send(user);
      }
    })
    .catch((e) => {
      if (e.name === "ValidationError") {
        next(new BAD_REQUEST("Error validating profile data"));
      } else if (e.code === 11000) {
        next(new CONFLICT_ERROR("This email is already exist"));
      } else {
        next(e);
      }
    });
};

module.exports = {
  createUser,
  updateProfile,
  login,
  getUserInfo,
};
