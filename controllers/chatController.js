
'use strict';
const Chat = require( '../models/Chat' );


exports.savePost = ( req, res ) => {
  //console.log("in saveSkill!")
  //console.dir(req)
  if (!res.locals.loggedIn) {
    return res.send("You must be logged in to post to the forum.")
  }


  let x =
   {
    user1: req.params.user1,
    user2: req.params.user2,
    email: req.user.googleemail,
    post: req.body.post,
    createdAt: new Date()
   }
   console.dir(x)
    let newChat = new Chat(x)

  //console.log("skill = "+newSkill)

  newChat.save()
    .then( () => {
      res.redirect( '/showChat/'+req.params.user1+'/'+req.params.user2 );
    } )
    .catch( error => {
      res.send( error );
    } );
};


// this displays all of the skills
exports.addPosts = ( req, res, next ) => {
  //gconsle.log('in getAllSkills')
  Chat.find({user1:req.params.user1,user2:req.params.user2}).sort({createdAt: -1})
    .exec()
    .then( ( posts ) => {
      res.render('showChat',{posts:posts,title:"Forum",user1:req.params.user1,user2:req.params.user2})
    } )
    .catch( ( error ) => {
      console.log( error.message );
      return [];
    } )
    .then( () => {
      //console.log( 'skill promise complete' );
    } );
};
