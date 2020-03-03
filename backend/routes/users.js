var express = require('express');
var router = express.Router();

let jwt = require('jsonwebtoken');

global.config = require('./config');
let User = require('../db/user.schema');

const bcrypt = require("bcrypt");

function cryptPassword(password, callback) {
  bcrypt.genSalt(10, function (err, salt) {
    if (err)
      return callback(err);

    bcrypt.hash(password, salt, function (err, hash) {
      return callback(err, hash);
    });
  });
};

function comparePassword(plainPass, hashword, callback) {
  bcrypt.compare(plainPass, hashword, function (err, isPasswordMatch) {
    return err == null ?
      callback(null, isPasswordMatch) :
      callback(err);
  });
};

/* Post users Login. */
router.post('/login', (req, res, next) => {

  User.findOne({
    email: req.body.email
  }, (error, userdata) => {

    //Go to server for user varificarion
    if (userdata) {
      comparePassword(req.body.password, userdata.password, (error, isValid) => {

        if (!isValid || error) {
          res.status(401).json({
            message: 'Username or password not correct'
          });
        }

        let token = jwt.sign(
          {
            'username': userdata.username,
            'title': userdata.title,
            'email': userdata.email
          }, global.config.secretKey, {
          algorithm: global.config.algorithm,
          expiresIn: '15m'
        });
        res.status(200).json({
          message: 'Login Successful',
          jwt: token
        });
      })

    }
    else {
      res.status(403).json({
        message: 'Forbiden'
      });
    }

  });
});

/* Post users registerations. */
router.post('/register', (req, res, next) => {
  // const salt = await bcrypt.genSalt(20);
  // const password = await bcrypt.hash(req.body.password, salt);
  cryptPassword(req.body.password, (err, newPass) => {
    console.log(newPass)
    if (err) {
      return next(err);
    }
    let newUser = new User({
      username: req.body.username,
      email: req.body.email,
      title: req.body.title,
      image: req.body.image,
      role: req.body.role,
      password: newPass,
      isVerified: false,
      isLeaved: false
    });

    console.log(req)
    newUser.save(function (err) {
      if (err) {
        return next(err);
      }
      res.send('User is Created successfully')
    })

  })

});

module.exports = router;
