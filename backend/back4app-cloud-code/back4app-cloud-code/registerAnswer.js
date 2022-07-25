const CheckAnswerEngine = require("./CheckAnswer.js");

Parse.Cloud.define("getQuestionResults", async (request) => {
  const {gameID, resultKey, questionNumber, buzzTimings, givenAnswer} = request.params;
  const query = new Parse.Query('Question');
  query.equalTo('gameID', gameID).equalTo('questionNumber', parseInt(questionNumber));

  const question = await query.first();
  const accAnswers = question.get("acceptableAnswers");
  
  const celerity = Math.max(
      0.0,
      1.0 - (buzzTimings.buzz - buzzTimings.play) / (1000 * buzzTimings.duration),
    );
  
  const {isCorrect, isFinal} = CheckAnswerEngine.checkAnswerList(givenAnswer, accAnswers);
  
  const resultQuery = new Parse.Query("GameResult");
  const resultRef = await resultQuery.get(resultKey);
  
  const gameQuery = new Parse.Query("Game");
  const gameRef = await gameQuery.get(gameID);
  
  const points = (isCorrect ? pointsFromCelerity(celerity) : 0);
  
  if(resultRef.get("player").id === request.user.id){
    if(resultRef.get("game").id === gameRef.id){
      registerQuestionResult({questionNumber, givenAnswer, buzzTimings, points, celerity, isCorrect, isFinal}, resultKey);
    }
  }

  return {
      question,
      celerity,
      points,
      givenAnswer,
      isCorrect
    };  
    
});


// registers the result of a single question
async function registerQuestionResult(resultData, resultKey) {
  const resultQuery = new Parse.Query("GameResult");
  const resultRef = await resultQuery.get(resultKey);
  
  const answers = resultRef.get("answers");
  
  const {questionNumber} = resultData;
  
  if(answers.find((q) => q.questionNumber === questionNumber)){
    return;
    // we don't want to overwrite answers
  }
  
  resultRef.set("answers", answers.concat([resultData]));
  
  resultRef.save(null, { useMasterKey: true });
}


// determines how many points a user earns by the percentage of the question that was read at the time they buzzed
function pointsFromCelerity(celerity) {
  return 10 + Math.floor(Math.sqrt(celerity) / 0.1);
}


