'use strict';
const User = require( '../models/User' );
const axios = require('axios');
//var apikey = require('../config/apikey');
//console.dir(apikey)


exports.update = ( req, res ) => {

  User.findOne(res.locals.user._id)
  .exec()
  .then((p) => {
    console.log("just found a profile")
    //console.dir(p)
    console.log("req.body = ")
    console.dir(req.body)

    // take from the form and put into user
    p.age = req.body.age
    p.profilePicURL = req.body.profilePicURL
    p.profilePic = req.body.profilePic
    p.address = req.body.address
    p.bio = req.body.bio
    p.lastUpdate = new Date()

    // interest attributes
    p.politics = (req.body.politics == "on")
    p.food = (req.body.food == "on")
    p.movies = (req.body.movies == "on")
    p.sports = (req.body.sports == "on")
    p.travel = (req.body.travel == "on")
    p.diy = (req.body.diy == "on")

    // save the users info in the user object
    p.save()
     .then( ( profile ) => {
      res.render( 'profile', {
          profile:profile, title:"Profile"
        } );

     })
    res.redirect('/profile')
   })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
  .finally(function () {
    // always executed
  });
};


exports.getAllProfiles = ( req, res ) => {
  //gconsle.log('in getAllSkills')
  User.find()
    .exec()
    .then( ( profiles ) => {
      res.render( 'profiles', {
        profiles:profiles, title:"Profiles"
      } );
    } )
    .catch( ( error ) => {
      console.log( error.message );
      return [];
    } )
    .then( () => {
      //console.log( 'skill promise complete' );
    } );
};

// this displays all of the skills
exports.getOneProfile = ( req, res ) => {
  //gconsle.log('in getAllSkills')
  const id = req.params.id
  console.log('the id is '+id)
  User.findOne({_id:id})
    .exec()
    .then( ( profile ) => {
      res.render( 'profile', {
        profile:profile, title:"Profile"
      } );
    } )
    .catch( ( error ) => {
      console.log( error.message );
      return [];
    } )
    .then( () => {
      //console.log( 'skill promise complete' );
    } );
};
