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
    p.age = req.body.age
    p.profilePicURL = req.body.profilePicURL
    p.address = req.body.address
    p.bio = req.body.bio
    p.lastUpdate = new Date()
    p.politics = (req.body.politics == "on")
    p.save()
     .then( ( profile ) => {
       console.log(profile.politics)
      res.render( 'profile', {
          profile:profile, title:"Profile"
        } );
     })
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
