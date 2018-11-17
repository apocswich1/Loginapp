var express = require('express')
var router = express.Router()


//register
router.get('/register', function(req, res){
    res.render('register')
})

//login
router.get('/login', function(req, res){
    res.render('login')
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
        console.log("PASSED")
    }
})


module.exports = router