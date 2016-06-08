var express = require('express');
var router = express.Router();
var knex = require('../db/knex');

var admin = require('./lib/admin');

router.use(admin.authorizeAdmin);

router.get('/',admin.getUsers);
router.get('/:id/delete',admin.deleteUser);
router.get('/:id/isAdmin/:isAdmin',admin.toggleAdmin);

module.exports = router;
