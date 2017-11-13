/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var passport = require('passport');

module.exports = {

  login: function (req, res) {
    res.view();
  },

  dashboard: function (req, res) {
    res.view();
  },

  logout: function (req, res){
    req.session.user = null;
    req.session.flash = 'You have logged out';
    res.redirect('user/login');
  },

  'wechat': function (req, res, next) {
  	console.log("=================");
  	// console.log(Object.keys(req));

     passport.authenticate('wechat', { scope:'snsapi_login'},
        function (err, user) {
        	console.log("passport 1 ");
        	//console.log(user);
        	//console.log(Object.keys(req));
        	//console.log(req.session);

            req.logIn(user, function (err) {
            if(err) {
                req.session.flash = 'There was an error';
                console.log("back to login");
                res.redirect('user/login');
            } else {
                req.session.user = user;
                res.redirect('/user/dashboard');
            }
        });
    })(req, res, next);
  },

  'wechat/callback': function (req, res, next) {
  	console.log("passport 2");
     passport.authenticate('wechat',
        function (req, res) {
            res.redirect('/user/dashboard');
        })(req, res, next);
  }

};

