var knex = require('../../db/knex');

function authorizeAdmin(req,res,next) {
  if (res.locals.user.isAdmin) {
    next();
  } else {
    res.redirect('/');
  }
}

function deleteUser(req,res,next) {
  knex('users')
  .where({id:req.params.id})
  .del()
  .then(function(data) {
    res.redirect('/admin');
  });
}

function getUsers(req,res,next) {
  logSecrets();
  knex('users').orderBy('id', 'asc').then(function (data) {
    res.render('admin', {rows: data});
  });
}

function toggleAdmin(req,res,next) {
    knex('users')
    .where({id:req.params.id})
    .update({isAdmin:req.params.isAdmin})
    .then(function (data) {
      res.redirect('/admin');
    })
}

module.exports = {
  authorizeAdmin: authorizeAdmin,
  deleteUser : deleteUser,
  getUsers : getUsers,
  toggleAdmin: toggleAdmin
}
