
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
      console.log("PLEASE APPEAR")
      // Uncomment this to test the pushToUsed function below

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

function pushToUsed(/* users ,*/ user1ID , user2ID ){
  // QUESTION FOR DR HICKEY -- How to pass users from res or req to this function???
  // Currently it is saying users is undifined because it isn't correctly passing users
  // from the rest of the code
 /*
 // just for testing
  console.log("User 1: " + user1ID)
  console.log("User 2: " + user2ID)

  console.log("A number not too big: " + users.length)
  console.log("Big number: " + users[0]._id)
  console.log("Undifined: " + users[0]._usedIDs[0])

  for(var i = 0; i < users.length; i++){
    if(users[i]._id == req.params.user1 ){
      users[i].usedIDs.push(req.params.user2)

    }
  }

*/
}
