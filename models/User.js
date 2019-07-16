
'use strict';
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

//var userSchema = mongoose.Schema( {any:{}})

var userSchema = Schema( {
  googleid: String,
  googletoken: String,
  googlename:String,
  googleemail:String,
  googlepicture:String,
  description: String,
  profilePicURL: String,
  profilePic:String,
  lastUpdate: Date,
  userName: String,
  bio:String,
  age:String,
  address:String,
  zipcode: String,
  city: String,
  state: String,
  politics: Boolean,
  food: Boolean,
  movies: Boolean,
  sports: Boolean,
  travel: Boolean,
  diy: Boolean,
  theyRequestedIDs: [ObjectId],
  youRequestedIDs: [ObjectId],
  theyAcceptedIDs: [ObjectId],
  youAcceptedIDs: [ObjectId]
} );



module.exports = mongoose.model( 'User', userSchema );

/*
newUser.google.id    = profile.id;
newUser.google.token = token;
newUser.google.name  = profile.displayName;
newUser.google.email = profile.emails[0].value; // pull the first email
*/
