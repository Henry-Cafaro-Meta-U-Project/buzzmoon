 // this function validates the parameters of a createGame request to ensure
 // that only valid games are created
 const validateCreateGameParams = (request) => {
  if(!request.user){
     throw "No user logged in";
  }
  
  if(!request.params.title || request.params.title.trim() === ""){
     throw "No title provided";
  }
  
  if(!request.params.description || request.params.description.trim() === ""){
     throw "No description provided";
  }
  
  if(!request.params.questionCount || request.params.questionCount === 0){
     throw "Can't create a game with zero questions";
  }
  
  if(!request.params.questions || request.params.questions.length === 0){
     throw "Can't create a game with zero questions";
  }
  
  request.params.questions.map((q) => {
    if(!q.answers || q.answers.length === 0 || (q.answers.length === 1 && q.answers[0] === '')){
      throw `Question #${q.questionNumber} has no answers provided`;
    }
    if(!q.audioFile) {
      throw `Question #${q.questionNumber} has no audio file provided`;
    }
    
    if(!(q.audioFile.name.endsWith(".m4a") || q.audioFile.name.endsWith(".mp3"))){
       throw `The file associated with Question #${q.questionNumber} must be an .m4a or an .mp3`;
     }
  })
  
  const currDate = new Date();
   if(request.params.endDate && request.params.endDate < currDate){
     throw `The deadline of the game cannot be before today's date`;
   }
  
  return;
}



// this function handles the creation of a game from the user supplied
// metadata, questions and audio
Parse.Cloud.define("createGame", async (request) => {
  const gameData = request.params;
  
  const query = new Parse.Query("Game");
  query.equalTo("title", gameData.title);
  const previousGames = await query.find();
  
  if(previousGames.length > 0){
    throw "A game with this title already exists";
  }
  
  //we are good to create a new game with new questions
  
  const newGame = new Parse.Object("Game");
  newGame.set("numQuestions", gameData.questionCount);
  newGame.set("author", request.user);
  newGame.set("players", []);
  newGame.set("title", gameData.title);
  newGame.set("description", gameData.description);
  newGame.set("endDate", gameData.endDate);
  
  const createdGame = await newGame.save(null, { useMasterKey: true });
  
  gameData.questions.map(async (q) => {
    const newQuestion = new Parse.Object("Question");
    
    newQuestion.set("questionNumber", q.questionNumber);
    newQuestion.set("answers", q.answers);
    newQuestion.set("acceptableAnswers", q.answers);
    newQuestion.set("blockedAnswers", []);
    
    newQuestion.set("gameID", createdGame.id);
    
    await newQuestion.save(null, { useMasterKey: true });
    
  })
  
  
  
  return {
    message:"Successful Upload",
    newGameId:createdGame.id
  }
}, validateCreateGameParams);