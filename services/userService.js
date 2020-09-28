var USER = require('../models/User');

exports.list = function (req, res, next) {
    res.render('list', { users: db.users });
};

exports.edit = function (req, res, next) {
    res.render('edit', { user: req.user });
};

exports.show = function (req, res, next) {
    res.render('show', { user: req.user });
};

exports.update = function (req, res, next) {
    var body = req.body;
    req.user.name = body.user.name;
    res.message('Information updated!');
    res.redirect('/user/' + req.user.id);
};