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
  
  const response = results.map((result) => {
    return {answers: 
              (result.get("answers").map((ans) => 
                                          ({givenAnswer: ans.givenAnswer,
                                            isCorrect: ans.isCorrect,
                                            questionNumber: ans.questionNumber})))};
  });
  
  return response;
  
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
});

Parse.Cloud.define("getAuthorGameData", async (request) => {
  const {gameID} = request.params;
  const query = new Parse.Query("Game");
  const gameRef = await query.get(gameID);
  
  const questionQuery = new Parse.Query("Question");
  questionQuery.equalTo("gameID", gameID.toString());
  const questions = await questionQuery.find();
  
  const questionData = questions.map((q) => {
    return {questionNumber: q.get("questionNumber"),
            answers: q.get("answers")};
  });
  
  return {title: gameRef.get("title"),
          questions: questionData};
  
}, async (request) => {
  const {gameID} = request.params;
  const entryModes = await getEntryModes(request, gameID);
  const modes = entryModes.modes;
  if(modes.includes("review")){
    return;
  }
  
  throw "You can't access this data";
});