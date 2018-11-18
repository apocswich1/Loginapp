let express = require("express");
let path = require("path");
let cookieParser = require("cookie-parser");
let bodyParser = require("body-parser");
let exphbs = require("express-handlebars");
let expressValidator = require("express-validator");
let flash = require("connect-flash");
let session = require("express-session");
let passport = require("passport");
let localStrategy = require("passport-local").Strategy;
let mongo = require("mongodb");
let mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/loginapp");
let db = mongoose.connection;

//rutas del sistema
var  routes = require("./routes/index");
var  users = require("./routes/users");

//Init app
let  app = express();

//View Engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout: 'layout'}));
app.set('view engine', 'handlebars');

//middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

//Set static folder
app.use(express.static(path.join(__dirname, 'public')));

//Express Session
app.use(session({
    secret: 'secret',
    saveUninitialized: false,
    resave: false
}));

app.use(passport.initialize());
app.use(passport.session());

//Express validator
app.use(expressValidator({
    errorFormatter: function(param, msg, value){
        var namespace = param.split('.')
    , root = namespace.shift()
    , formParam = root;
    
    while(namespace.length){
        formParam += '[' + namespace.shift() + ']'; 
    }

    return {
        param: formParam,
        msg: msg,
        value: value
    }
    }
}));

//Falsh middleware
app.use(flash());

//Global vars
app.use(function(req, res, next){
    res.locals.success_msg = req.flash("success_msg")
    res.locals.error_msg = req.flash("error_msg")
    res.locals.error = req.flash("error")
    res.locals.user = req.user || null;
    next()
});

app.use('/',routes);
app.use('/users', users);

//rutas no encontradas
app.use( (req, res, next) => {
    res.status(404);
    //res.json({
      //"error": "Error. Route not found"
    //});
    req.flash('error_msg','Ruta no encontrada');
    res.redirect('/users/login')
});

app.set('port', (process.env.PORT || 3000))

app.listen(app.get('port'),function(){
    console.log('Server running on port: '+ app.get('port'))
})