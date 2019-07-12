'use strict';
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

var chatSchema = Schema( {
  user1: ObjectId,
  user2: ObjectId,
  post: String,
  createdAt: Date
} );

module.exports = mongoose.model( 'Chat', chatSchema );
