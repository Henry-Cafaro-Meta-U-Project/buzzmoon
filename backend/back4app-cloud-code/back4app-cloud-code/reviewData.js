const {getEntryModes} = require ("./validation.js");




// returns the data of questions and answer for a given game
// can only be accessed by game author

Parse.Cloud.define("getAuthorResults", async (request) => {
  const {gameID} = request.params;
  
  const questions = [];
  
  const query = new Parse.Query("Game");
  const gameRef = await query.get(gameID);
  const numQuestions = await gameRef.get("numQuestions");
  
  const resultsQuery = new Parse.Query("GameResult");
  resultsQuery.equalTo("game", gameRef);
  const results = await resultsQuery.find();
  
  return results;
  
  // for(let i = 1; i <= numQuestions; i++){
    
  // }
  
  
}, async (request) => {
  const {gameID} = request.params;
  const entryModes = await getEntryModes(request, gameID);
  const modes = entryModes.modes;
  if(modes.includes("review")){
    return;
  }
  
  throw "You can't access this data";
})