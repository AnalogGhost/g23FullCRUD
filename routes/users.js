var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');

var knex = require('../db/knex');

var utils = require('./lib/utils.js');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/signup',redirectSignedIn,function(req,res,next) {
  res.render('signup');
});

router.post('/signup',function(req,res,next) {
  var password = bcrypt.hashSync(req.body.password,8);

  knex('users').where({username: req.body.username.toLowerCase()})
  .then(function(data) {
    if (data.length) {
      res.render('signuperror');
    }

    knex('users').insert(
      {
        username: req.body.username.toLowerCase(),
        password: password
      }
    ).returning('id')
    .then(utils.flatten)
    .then(function(id) {
      req.session.id = id;
      res.redirect('/');
    })
    .catch(function(err) {
      next(err);
    });
  })
  .catch(function(err) {
    next(err);
  });

});

router.get('/signin', redirectSignedIn,function(req,res,next) {
  res.render('signin');
});

router.post('/signin', function(req,res,next) {
  knex('users')
    .where({username: req.body.username.toLowerCase()})
    .first()
    .then(function(data) {
      if (!data) {
        res.render('signinfailure')
      }

      if (bcrypt.compareSync(req.body.password,data.password))
      {
          req.session.id = data.id;
          res.redirect('/')
      }
      else
      {
        res.render('signinfailure')
      }
    });
});

router.get('/signout', function (req,res,next) {
  req.session = null;
  res.redirect('/');
});

function redirectSignedIn(req,res,next) {
  if (!req.session.id) {
    next();
  }
  res.redirect('/')
}

module.exports = router;
