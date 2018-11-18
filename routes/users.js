var express = require('express')
var router = express.Router()
var User = require('../models/user')
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;

//ensure authenticated
function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }else{
        //req.flash('error_msg','You are not logged in');
        res.redirect('/users/login');
    }
}

//register
router.get('/', ensureAuthenticated, function(req, res){
    res.render('index')
})

//register
router.get('/register', function(req, res){
    res.render('register')
})

//login
router.get('/login', function(req, res){
    res.render('login')
})

//login
router.get('/logout', function(req, res){
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login')
})

//register user
router.post('/register', function(req, res){
    var name = req.body.name;
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    var cpassword = req.body.cpassword;

    req.checkBody('name','Name is required').notEmpty();
    req.checkBody('username','Username is required').notEmpty();
    req.checkBody('email','Email is required').notEmpty();
    req.checkBody('email','Verify Email format').notEmpty();
    req.checkBody('password','Password is required').notEmpty();
    req.checkBody('cpassword','Password do not match').equals(req.body.password);
    req.checkBody('cpassword','Second password is required').notEmpty();

    var errors = req.validationErrors();

    if(errors){
        res.render("register",{
            errors: errors
        });
    }else{
        var newUser = new User({
            name: name,
            username:username,
            email:email,
            password:password
        })

        User.createUser(newUser,function(err, user){
            if(err) throw err;
            console.log(user)
        });

        req.flash('success_msg', "You are registered and can now login");
        res.redirect("/users/login");
        console.log("PASSED")
    }
})

passport.use(new LocalStrategy(
    function(username, password, done) {
     User.getUserByUsername(username, function(err,user){
        if(err) throw err;
        if(!user){
            return done(null,false,{message:'Unknown user'})
        }
        User.comparePassword(password, user.password, function(err, isMatch){
            if(err) throw err;
            if(isMatch){
                return done(null, user);
            }else{
                return done(null, false, {message: 'Invalid Password'});
            }
            
        })
     });   
    }));

    passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
      
      passport.deserializeUser(function(id, done) {
        User.getUserById(id, function(err, user) {
          done(err, user);
        });
      });


router.post('/login',
  passport.authenticate('local',{successRedirect:'/',failureRedirect:'/users/login',failureFlash:true}),
  function(req, res) {
    res.redirect('/')
  });


module.exports = router