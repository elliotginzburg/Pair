var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//var apikey = require('./config/apikey');

// AUTHENTICATION MODULES
session = require("express-session"),
bodyParser = require("body-parser"),
flash = require('connect-flash')
// END OF AUTHENTICATION MODULES

const mongoose = require( 'mongoose' );
const MONGOLAB_GOLD_URI = 'mongodb://heroku_14n0lj90:9oh7veboks1o4up0ovnk03m104@ds243607.mlab.com:43607/heroku_14n0lj90'

var uristring =
    process.env.MONGOLAB_GOLD_URI ||
    process.env.MONGOHQ_URL ||
    // pick localhost or mlab
    'mongodb://localhost/mydb';
    //'mongodb://heroku_1mh6jvp2:mggno2vrjh2036n5tf58ppqh7t@ds247637.mlab.com:47637/heroku_1mh6jvp2';

    // Makes connection asynchronously.  Mongoose will queue up database
    // operations and release them when the connection is complete.
    mongoose.connect(uristring, function (err, res) {
      if (err) {
      console.log ('ERROR connecting to: ' + uristring + '. ' + err);
      } else {
      console.log ('Succeeded connected to: ' + uristring);
      }
    });

// for localhost
mongoose.connect( 'mongodb://localhost/mydb', { useNewUrlParser: true } );

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("we are connected!!!")
});

const commentController = require('./controllers/commentController')
const profileController = require('./controllers/profileController')
const forumPostController = require('./controllers/forumPostController')
const quiz2Controller = require('./controllers/quiz2Controller')
const pairsController = require('./controllers/pairsController')
const chatController=require("./controllers/chatController")
// Authentication
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
// here we set up authentication with passport
const passport = require('passport')
const configPassport = require('./config/passport')
configPassport(passport)


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



/*************************************************************************
     HERE ARE THE AUTHENTICATION ROUTES
**************************************************************************/

app.use(session(
  { secret: 'zzbbyanana',
    resave: false,
    saveUninitialized: false }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({ extended: false }));



const approvedLogins = ["tjhickey724@gmail.com","csjbs2018@gmail.com","jai.vdamani@gmail.com"];

// here is where we check on their logged in status
app.use((req,res,next) => {
  res.locals.title="Pair"
  res.locals.loggedIn = false
  if (req.isAuthenticated()){
      console.log("user has been Authenticated")
      res.locals.user = req.user
      res.locals.loggedIn = true
    }
  else {
    res.locals.loggedIn = false
  }
  next()
})



// here are the authentication routes

app.get('/loginerror', function(req,res){
  res.render('loginerror',{})
})

app.get('/login', function(req,res){
  res.render('login',{})
})



// route for logging out
app.get('/logout', function(req, res) {
        req.session.destroy((error)=>{console.log("Error in destroying session: "+error)});
        console.log("session has been destroyed")
        req.logout();
        res.redirect('/');
    });


// =====================================
// GOOGLE ROUTES =======================
// =====================================
// send to google to do the authentication
// profile gets us their basic information including their name
// email gets their emails
app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));


app.get('/login/authorized',
        passport.authenticate('google', {
                successRedirect : '/',
                failureRedirect : '/loginerror'
        })
      );


// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    console.log("checking to see if they are authenticated!")
    // if user is authenticated in the session, carry on
    res.locals.loggedIn = false
    if (req.isAuthenticated()){
      console.log("user has been Authenticated")
      res.locals.loggedIn = true
      return next();
    } else {
      console.log("user has not been authenticated...")
      res.redirect('/login');
    }
}
app.get('/home', function(req, res) {
        res.render('home')
});
app.get('/choose', function(req, res) {
        res.render('choose')
});



// we require thowoem to be logged in to see their profile

app.get('/showChat/:user1/:user2',
        chatController.addPosts,
        function(req, res) {
           res.render('showChat')


});

app.post('/showChat/:user1/:user2',
        chatController.savePost)

//Uncomment this allow database reset
/*app.get('/resetDB',(req,res)=>{
  // this deletes all of the documents in all collections
  require('./models/Chat').deleteMany({}).exec()
  require('./models/Comment').deleteMany({}).exec()
  require('./models/ForumComment').deleteMany({}).exec()
  require('./models/ForumPost').deleteMany({}).exec()
  require('./models/MovieRating').deleteMany({}).exec()
  require('./models/User').deleteMany({}).exec()
  res.redirect('/')
})*/

app.get('/yourpairs', pairsController.attachTopFive,
    function(req, res) {
        res.render('yourpairs')
});

app.get('/simon', function(req, res) {
        res.render('simon',{title: "Simon's Page"})
    });

app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile')
});


app.get('/aboutpages', function(req, res) {
          res.render('aboutpages')
});

// CHAT CHANGE
app.get('/chat',(req,res,next)=>{
  res.render('chat',{title:"ChatDemo"});
})


app.get('/editProfile',isLoggedIn, (req,res)=>{
  res.render('editProfile')
})

app.get('/chat',isLoggedIn, (req,res)=>{
  res.render('chat')
})
app.get('/location', isLoggedIn, function(req, res) {
        res.render('location')
});


app.get('/interests', (req,res)=>{
  res.render('interests')
})

app.get('/profiles', isLoggedIn, profileController.getAllProfiles);
app.get('/showProfile/:id', isLoggedIn, profileController.getOneProfile);


app.post('/updateProfile',profileController.update)


// add page for editProfile and views
// add router for updateProfile and send browser to /profie

// END OF THE AUTHENTICATION ROUTES

app.use(function(req,res,next){
  console.log("about to look for routes!!!")
  //console.dir(req.headers)
  next()
});


app.get('/', function(req, res, next) {
  res.render('index',{title:"Pair"});
});

app.get('/quiz2',quiz2Controller.getAllMovieRatings)



app.get('/forum',forumPostController.getAllForumPosts)

app.post('/forum',forumPostController.saveForumPost)

app.post('/forumDelete',forumPostController.deleteForumPost)

app.get('/showPost/:id',
        forumPostController.attachAllForumComments,
        forumPostController.showOnePost)

// CHAT CHANGE
app.get('/showPostComments/:id',
        forumPostController.attachAllForumComments,
        (req,res)=>{
          res.render('forumPostComments',{title:"comments"})
        })


app.post('/saveForumComment',forumPostController.saveForumComment)




app.get('/griddemo', function(req, res, next) {
  res.render('griddemo',{title:"Grid Demo"});
});



app.get('/bmidemo', (req, res) => {
  res.render('bmidemo',{title:"BMI Demo"});
});



// myform demo ...

app.get('/myform', function(req, res, next) {
  res.render('myform',{title:"Form Demo"});
});

app.post('/processform', commentController.saveComment)

app.get('/showComments', commentController.getAllComments)
// app.use('/', indexRouter);  // this is how we use a router to handle the / path
// but here we are more direct

app.get('/showComment/:id', commentController.getOneComment)

function processFormData(req,res,next){
  res.render('formdata',
     {title:"Form Data",url:req.body.url, coms:req.body.theComments})
}





// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

// image gallery
// init the state from the input
