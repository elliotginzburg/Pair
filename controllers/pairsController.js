'use strict';
const User = require( '../models/User' );

exports.refresh = (req, res, next) => {
  res.locals.limit = req.body.limit;

  next()
}


// this displays all of the skills
exports.attachTopFive = ( req, res, next ) => {
  //gconsle.log('in getAllSkills')
  User.find()
    .exec()
    .then( ( users ) => {
      res.locals.topFive = getTopFive(users, req.user, res.locals.limit || 5)
      res.locals.users = getUsers(users)
      // add declineChat and chatNow functions
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


/*
function chatNow( id, user ){
  user.usedIDs.push( id );
  user.acceptedIDs.push( id );
}

function declineChat( id, user ){
  user.usedIDs.push( id );
  user.declinedIDs.push( id );
}
*/

function getUsers(users){
  return users;
}

/*
Step 1: Initialize array for all except forbidden
Step 2: Count all instances of duplicate interests
Step 3: Sort by decending order - number of similar interests
Step 4: Return only the top 5
*/

function getTopFive(users, user, limit){

  // ----------------------- Step 1 --------------------------//
  var counterArray = [];

  // for every user, and every possible forbidden id
  var i;
  var j;
  var flag = false;

  for(i = 0; i < users.length; i++) {

    if(user.googlename != users[i].googlename){
      counterArray.push([ i , 0, flag]);
    }

    /*
    var flag = true;

    for(j = 0; j < usedIDs.length; j++) {
      if(user[i].id == usedIDs[j]){
        flag = false;
      }
    }
    if(flag){
      // initialize 2d array: [ id , 0 (will be added to later)]
      counterArray.push([ i , 0 ]);
    }
    */
  }

  // ----------------------- Step 2 --------------------------//

  // data structure [id, counter ] counter is being added to

  if(user.politics){
    // add to all who also like politics
    for(i = 0; i < counterArray.length; i++){
      // check if the user also likes politics
      //console.log(users[counterArray[i][0]].politics)
      if(users[counterArray[i][0]].politics){
        // add one to the counter side of the 2d array
        counterArray[i][1]++;
        counterArray[i][2] = true;
      }
    }
  } else{
      for(i = 0; i < counterArray.length; i++){

        if(users[counterArray[i][0]].politics){

          counterArray[i][1] = counterArray[i][1] - 0.5;
        }
      }
    }

  if(user.food){
    // add to all who also like ...
    for(i = 0; i < counterArray.length; i++){
      // check if the user also likes ...
      if(users[counterArray[i][0]].food){
        // add one to the counter side of the 2d array
        counterArray[i][1]++;
        counterArray[i][2] = true;
      }
    }
  }  else{
      for(i = 0; i < counterArray.length; i++){

        if(users[counterArray[i][0]].food){
        }
      }
    }

  if(user.movies){
    // add to all who also like ...
    for(i = 0; i < counterArray.length; i++){
      // check if the user also likes ...
      if(users[counterArray[i][0]].movies){
        // add one to the counter side of the 2d array
        counterArray[i][1]++;
        counterArray[i][2] = true;
      }
    }
  }  else{
      for(i = 0; i < counterArray.length; i++){

        if(users[counterArray[i][0]].movies){

          counterArray[i][1] = counterArray[i][1] - 0.5;
        }
      }
    }

  if(user.sports){
    // add to all who also like ...
    for(i = 0; i < counterArray.length; i++){
      // check if the user also likes ...
      if(users[counterArray[i][0]].sports){
        // add one to the counter side of the 2d array
        counterArray[i][1]++;
        counterArray[i][2] = true;
      }
    }
  }  else{
      for(i = 0; i < counterArray.length; i++){

        if(users[counterArray[i][0]].sports){

          counterArray[i][1] = counterArray[i][1] - 0.5;
        }
      }
    }

  if(user.travel){
    // add to all who also like ...
    for(i = 0; i < counterArray.length; i++){
      // check if the user also likes ...
      if(users[counterArray[i][0]].travel){
        // add one to the counter side of the 2d array
        counterArray[i][1]++;
        counterArray[i][2] = true;
      }
    }
  }  else{
      for(i = 0; i < counterArray.length; i++){

        if(users[counterArray[i][0]].travel){

          counterArray[i][1] = counterArray[i][1] - 0.5;
        }
      }
    }

  if(user.diy){
    // add to all who also like ...
    for(i = 0; i < counterArray.length; i++){
      // check if the user also likes ...
      if(users[counterArray[i][0]].diy){
        // add one to the counter side of the 2d array
        counterArray[i][1]++;
        counterArray[i][2] = true;
      }
    }
  }  else{
      for(i = 0; i < counterArray.length; i++){

        if(users[counterArray[i][0]].diy){

          counterArray[i][1] = counterArray[i][1] - 0.5;
        }
      }
    }
    for(i = 0; i < counterArray.length; i++){
      console.log(i + ": " + counterArray[i][1] + counterArray[i][2])
    }


// ----------------------- Step 3 --------------------------//

  var max;

  for(var startHere = 0; startHere < counterArray.length; startHere++){

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


// ----------------------- Step 4 --------------------------//

  var topFive = [];

  if(counterArray.length < limit){
    for(i = 0; i < counterArray.length; i++){


        if(counterArray[i][2] == true)
          topFive.push(counterArray[i][0]);

      /*if(counterArray[i][1] != 0){
        topFive.push(counterArray[i][0]);*/

      }
    }

    else{
      for(i = 0; i < limit; i++){
        if(counterArray[i][2] == true) {
          topFive.push(counterArray[i][0]);
        }
      }
    }

  return topFive;

}


//use to close
