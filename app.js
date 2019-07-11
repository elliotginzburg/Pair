var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//var apikey = require('./config/apikey');

// AUTHENTICATION MODULES
session = require("express-session"),
bodyParser = require("body-parser"),
User = require( './models/User' ),
flash = require('connect-flash')
// END OF AUTHENTICATION MODULES

const mongoose = require( 'mongoose' );
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



const approvedLogins = ["tjhickey724@gmail.com","csjbs2018@gmail.com"];

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



// we require them to be logged in to see their profile
app.get('/Jai',function(req, res) {
        res.render('Jai')
});

app.get('/yourpairs',function(req, res) {
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


app.get('/editProfile',isLoggedIn, (req,res)=>{
  res.render('editProfile')
})

app.get('/chat',isLoggedIn, (req,res)=>{
  res.render('chat')
})

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


/*
Step 1: Initialize array for all except forbidden
Step 2: Count all instances of duplicate interests
Step 3: Sort by decending order - number of similar interests
Step 4: Return only the top 5
*/

/* delete this for code
function getTopFive{

  // ----------------------- Step 1 --------------------------//
  var counterArray = [];

  // for every user, and every possible forbidden id
  for(int i = 0; i < numberOfUsers; i++) {

    // turn flag to false if it hits a forbidden id
    var flag = true;

    for(j = 0; j < forbidden.length; j++) {
      if(user[i].id == forbidden[j]){
        flag = false;
      }
    }
    if(flag){
      // initialize 2d array: [ id , 0 (will be added to later)]
      counterArray.push([ i , 0 ]);
    }
  }

  // ----------------------- Step 2 --------------------------//

  if(user.politics){
    // add to all who also like politics
    for(i = 0; i < counterArray.length; i++){
      // check if the user also likes politics
      if(counterArray[i][0].politics){
        // add one to the counter side of the 2d array
        counterArray[i][1]++;
      }
    }
  }
  if(user.food){
    // add to all who also like ...
    for(i = 0; i < counterArray.length; i++){
      // check if the user also likes ...
      if(counterArray[i][0].food){
        // add one to the counter side of the 2d array
        counterArray[i][1]++;
      }
    }
  }
  if(user.movies){
    // add to all who also like ...
    for(i = 0; i < counterArray.length; i++){
      // check if the user also likes ...
      if(counterArray[i][0].movies){
        // add one to the counter side of the 2d array
        counterArray[i][1]++;
      }
    }
  }
  if(user.sports){
    // add to all who also like ...
    for(i = 0; i < counterArray.length; i++){
      // check if the user also likes ...
      if(counterArray[i][0].sports){
        // add one to the counter side of the 2d array
        counterArray[i][1]++;
      }
    }
  }
  if(user.travel){
    // add to all who also like ...
    for(i = 0; i < counterArray.length; i++){
      // check if the user also likes ...
      if(counterArray[i][0].travel){
        // add one to the counter side of the 2d array
        counterArray[i][1]++;
      }
    }
  }
  if(user.diy){
    // add to all who also like ...
    for(i = 0; i < counterArray.length; i++){
      // check if the user also likes ...
      if(counterArray[i][0].diy){
        // add one to the counter side of the 2d array
        counterArray[i][1]++;
      }
    }
  }

// ----------------------- Step 3 --------------------------//

  for(startHere = 0; startHere < counterArray.length; startHere++){

    //set the max equal to the first term
    max = startHere;

    for(j = startHere; j < counterArray.length; j++){
      if( counterArray[max][1] < counterArray[j][1] ){
        max = j;
      }
    }

    //swap startHere and j
    var temp = counterArray[startHere];
    counterArray[startHere] = counterArray[max];
    counterArray[max] = temp;

  }


}
*/


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
