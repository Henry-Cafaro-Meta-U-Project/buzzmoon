const {getEntryModes} = require ("./validation.js");
const CheckAnswerEngine = require("./CheckAnswer.js");



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
                                            isFinal: ans.isFinal,
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


// this function updates the acceptable answers for a set of questions given the author's 
// desired changes
Parse.Cloud.define("updateRulings", async (request) => {
  const {gameID, changes} = request.params;
  
  const gameQuery = new Parse.Query("Game");
  const gameRef = await gameQuery.get(gameID);
  
  const questionQuery = new Parse.Query("Question");
  questionQuery.equalTo("gameID", gameID);
  
  const questionRefs = await questionQuery.find();
  
  await Promise.all(changes.map(async (change) => {
    const {questionNumber, answer, ruling} = change;
    const qRef = questionRefs.find((e) => (e.get("questionNumber") === questionNumber));
    
    if(ruling === "correct"){
      const accAnswers = qRef.get("acceptableAnswers");
      if(! accAnswers.find((x) => (x === answer))){
        qRef.set("acceptableAnswers", accAnswers.concat([answer]));
        await qRef.save(null, {useMasterKey: true});
      }
    } else if (ruling === "incorrect") {
      const blockAnswers = qRef.get("blockedAnswers");
      if(! blockAnswers.find((x) => (x === answer))){
        qRef.set("blockedAnswers", blockAnswers.concat([answer]));
        await qRef.save(null, {useMasterKey: true});
      }
    }
    
    
  }));
  
  await regrade(gameID);
  
}, async (request) => {
  const {gameID} = request.params;
  const entryModes = await getEntryModes(request, gameID);
  const modes = entryModes.modes;
  if(modes.includes("review")){
    return;
  }
  
  throw "You can't take this action";
})

// this recalculates scores for every result for a given game
const regrade = async (gameID) => {
  const gameQuery = new Parse.Query("Game");
  const gameRef = await gameQuery.get(gameID);
  
  const resQuery = new Parse.Query("GameResult");
  resQuery.equalTo("game", gameRef);
  const results = await resQuery.find();
  
  const questionQuery = new Parse.Query("Question");
  questionQuery.equalTo("gameID", gameID);
  const questions = await questionQuery.find();
  
  await Promise.all(results.map(async (res) => {
    let newAnswers = [];
    res.get("answers").map((ans) => {
      const {questionNumber, givenAnswer, buzzTimings, points, celerity, isCorrect, isFinal} = ans;
      
    
      const question = questions.find((e) => (e.get("questionNumber") === questionNumber));
      const accAnswers = question.get("acceptableAnswers");
      const blockAnswers = question.get("blockedAnswers");
      
      const newRuling = CheckAnswerEngine.checkAnswerList(givenAnswer, accAnswers, blockAnswers);
      const newIsCorrect = newRuling.isCorrect;
      const newIsFinal = newRuling.isFinal;
      const newPoints = (newIsCorrect ? pointsFromCelerity(celerity) : 0);
      
      newAnswers.push({questionNumber, givenAnswer, buzzTimings, points:newPoints, celerity,
                        isCorrect:newIsCorrect, isFinal:newIsFinal});
      });
    
    res.set("answers", newAnswers);
    await res.save(null, {useMasterKey: true});
      
      
      
    }));
  }


// determines how many points a user earns by the percentage of the question that was read at the time they buzzed
function pointsFromCelerity(celerity) {
  return 10 + Math.floor(Math.sqrt(celerity) / 0.1);
}