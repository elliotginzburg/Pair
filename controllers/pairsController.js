'use strict';
const User = require( '../models/User' );


// this displays all of the skills
exports.attachTopFive = ( req, res, next ) => {
  //gconsle.log('in getAllSkills')
  User.find().limit(5)
    .exec()
    .then( ( users ) => {
      res.locals.topFive = getTopFive(users, req.user)
      res.locals.users = getUsers(users)
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
Step 1: Initialize array for all except forbidden
Step 2: Count all instances of duplicate interests
Step 3: Sort by decending order - number of similar interests
Step 4: Return only the top 5
*/
function getUsers(users){
  return users;
}



function getTopFive(users, user){

  // ----------------------- Step 1 --------------------------//
  var counterArray = [];

  // for every user, and every possible forbidden id
  var i;
  var j;

  for(i = 0; i < users.length; i++) {

    // turn flag to false if it hits a forbidden id
    /* var flag = true;

    for(j = 0; j < forbidden.length; j++) {
      if(user[i].id == forbidden[j]){
        flag = false;
      }
    }
    if(flag){
      // initialize 2d array: [ id , 0 (will be added to later)]
      counterArray.push([ i , 0 ]);
    } */
    counterArray.push([ i , 0 ]);
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
      }
    }
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

  if(counterArray.length < 5){
    for(i = 0; i < counterArray.length; i++){

      if(counterArray[i][1] != 0){
        topFive.push(counterArray[i][0]);
      }

    }
  }
  else{
    for(i = 0; i < 5; i++){

      if(counterArray[i][1] != 0){
        topFive.push(counterArray[i][0]);
      }

    }
  }

  return topFive;

}


//use to close
