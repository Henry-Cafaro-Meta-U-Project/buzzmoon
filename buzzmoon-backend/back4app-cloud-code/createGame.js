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
  })
  
  return;
}



// this function handles the creation of a game from the user supplied
// metadata, questions and audio
Parse.Cloud.define("createGame", (request) => {
  return "Successful Upload";
}, validateCreateGameParams);