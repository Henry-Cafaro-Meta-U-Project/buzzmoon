

Parse.Cloud.define("checkEntryMode", async (request) => {
  const {gameID} = request.params;
  
  if(request.user.id === "0G3bHIsF6A"){
    return {mode:"play"};
  }
  
  const query = new Parse.Query("GameResult");
  
  const gameQuery = new Parse.Query("Game");
  const gameRef = await gameQuery.get(gameID);
  
  query.equalTo("player", request.user).equalTo("game", gameRef);
  
  const response = await query.first();
  if(response) {
    return {mode:"results"};
  }
  else {
    return {mode:"play"};
  }
});

Parse.Cloud.define("registerGameEntry", async (request) => {
  const {gameID} = request.params;
  
  // need to add check if gameResult already exists, and error if so
  
  const newGameResult = new Parse.Object("GameResult");
  
  newGameResult.set("player", request.user);
  newGameResult.set("answers", []);
  
  const gameQuery = new Parse.Query("Game");
  const gameRef = await gameQuery.get(gameID);
  
  newGameResult.set("game", gameRef);
  
  await newGameResult.save(null, { useMasterKey: true });
  
  return {message:"successful entry", resultKey:newGameResult.id};
  
});


Parse.Cloud.define("getQuestionResults", async (request) => {
  const {gameID, questionNumber, buzzTimings, givenAnswer} = request.params;
  const query = new Parse.Query('Question');
  query.equalTo('gameID', gameID).equalTo('questionNumber', parseInt(questionNumber));

  const question = await query.first();
  const answers = question.get("answers");
  
  const celerity = Math.max(
      0.0,
      1.0 - (buzzTimings.buzz - buzzTimings.play) / (1000 * buzzTimings.duration),
    );
  
  const isCorrect = checkAnswerCorrectness(givenAnswer, answers);

  return {
      question,
      celerity,
      points:(isCorrect ? pointsFromCelerity(celerity) : 0),
      givenAnswer,
      isCorrect
    };  
    
});

// checks the correctness of a given answer by comparing to a list of acceptable answers
function checkAnswerCorrectness(givenAnswer, acceptableAnswers) {
  let answerChecks = acceptableAnswers.map((ans) => (ans.toLowerCase() == givenAnswer.toLowerCase()));
  return answerChecks.reduce((acc, elem) => (acc || elem), false);
}

// determines how many points a user earns by the percentage of the question that was read at the time they buzzed
function pointsFromCelerity(celerity) {
  return 10 + Math.floor(Math.sqrt(celerity) / 0.1);
}


