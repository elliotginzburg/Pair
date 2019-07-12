/*

'use strict';
const chat = require( '../models/chat' );


exports.savePost = ( req, res ) => {
  //console.log("in saveSkill!")
  //console.dir(req)
  if (!res.locals.loggedIn) {
    return res.send("You must be logged in to post to the forum.")
  }

  let newChat = new Chat(
   {
    user1: req.param.user1,
    user2: req.param.user2,
    post: req.body.post,
    createdAt: new Date()
   }
  )

  //console.log("skill = "+newSkill)

  newChat.save()
    .then( () => {
      res.redirect( '/showChat/'+req.param.user1+'/'+req.param.user2 );
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

exports.deleteForumPost = (req, res) => {
  console.log("in deleteForumPost")
  let deleteId = req.body.delete
  if (typeof(deleteId)=='string') {
      // you are deleting just one thing ...
      ForumPost.deleteOne({_id:deleteId})
           .exec()
           .then(()=>{res.redirect('/forum')})
           .catch((error)=>{res.send(error)})
  } else if (typeof(deleteId)=='object'){
      ForumPost.deleteMany({_id:{$in:deleteId}})
           .exec()
           .then(()=>{res.redirect('/forum')})
           .catch((error)=>{res.send(error)})
  } else if (typeof(deleteId)=='undefined'){
      //console.log("This is if they didn't select a skill")
      res.redirect('/forum')
  } else {
    //console.log("This shouldn't happen!")
    res.send(`unknown deleteId: ${deleteId} Contact the Developer!!!`)
  }

};


// this displays all of the skills
exports.showOnePost = ( req, res ) => {
  //gconsle.log('in getAllSkills')
  const id = req.params.id
  console.log('the id is '+id)
  ForumPost.findOne({_id:id})
    .exec()
    .then( ( forumPost ) => {
      res.render( 'forumPost', {
        post:forumPost, title:"Forum Post"
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


exports.saveForumComment = (req,res) => {
  if (!res.locals.loggedIn) {
    return res.send("You must be logged in to post a comment to the forum.")
  }

  let newForumComment = new ForumComment(
   {
    userId: req.user._id,
    postId: req.body.postId,
    userName:req.user.googlename,
    comment: req.body.comment,
    createdAt: new Date()
   }
  )

  //console.log("skill = "+newSkill)

  newForumComment.save()
    .then( () => {
      res.redirect( 'showPost/'+req.body.postId );
    } )
    .catch( error => {
      res.send( error );
    } );
}




// this displays all of the skills
exports.attachAllForumComments = ( req, res, next ) => {
  //gconsle.log('in getAllSkills')
  console.log("in aAFC with id= "+req.params.id)
  var ObjectId = require('mongoose').Types.ObjectId;
  ForumComment.find({postId:ObjectId(req.params.id)}).sort({createdAt:-1})
    .exec()
    .then( ( comments ) => {
      console.log("comments.length=")
      console.dir(comments.length)
      res.locals.comments = comments
      next()
    } )
    .catch( ( error ) => {
      console.log( error.message );
      return [];
    } )
    .then( () => {
      //console.log( 'skill promise complete' );
    } );
};

*/
