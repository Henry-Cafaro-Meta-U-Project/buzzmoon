import * as Parse from 'parse/dist/parse.min.js'

Parse.initialize(`nUrzDufzLEaJ3sjzvcvNHvw1hD46jOt4yEipaWHs`, `juaO5lbdY5jTtDXGpzEr2mGtggC0wf2Es11cEruf`);
Parse.serverURL = 'https://parseapi.back4app.com/';


export default class BackendActor {

  //handles the user login in the Auth component
  static async handleLogin(username, password, setCurrentUser){
    try {
      const loggedInUser = await Parse.User.logIn(username, password);
      console.log(`Successful login: user ${loggedInUser.get(
          'username'
        )} has signed in`);

        setCurrentUser(loggedInUser);
        localStorage.setItem('user', loggedInUser);


    } catch (error) {
      alert(`error: ${error.message}`);
    }

  }

  //handles the user logout triggered by the logout button
  static async handleLogOut(setCurrentUser) {
    try {
      await Parse.User.logOut();
      setCurrentUser(null);
      localStorage.setItem('user', null);
    } catch (error) {
      console.log('error: ', error);
      
    }
  }

  //fetches the audio url of a question from the server
  static async getServerAudioURL(gameID, questionNumber) {
    const query = new Parse.Query("Question");
    query.equalTo("gameID", gameID).equalTo("questionNumber", parseInt(questionNumber));


    const responses = await query.find();
    const data = responses[0].attributes;

    return data.audio._url;
  }

  //fetches a list of available games
  static async getGames() {
    const query = new Parse.Query("Game");
    const responses = await query.find();
    return responses;
  }

  //fetches the results of a question, given the user's answer and timings
  static async getQuestionResults(gameID, questionNumber, givenAnswer, buzzTimings){
    const query = new Parse.Query("Question");
    query.equalTo("gameID", gameID).equalTo("questionNumber", parseInt(questionNumber));


    const responses = await query.find();
    const data = responses[0].attributes;

    const celerity = Math.max(
      0.0,
      1.0 - (buzzTimings.buzz - buzzTimings.play) / (1000 * buzzTimings.duration),
    );

    const isCorrect = this.checkAnswerCorrectness(givenAnswer, data.answers);
    return {question: data, celerity: celerity, points:(isCorrect ? this.pointsFromCelerity(celerity) : 0),
      givenAnswer: givenAnswer, isCorrect:isCorrect};
  }

  //checks the correctness of a given answer by comparing to a list of acceptable answers
  static checkAnswerCorrectness(givenAnswer, acceptableAnswers){
    let answerChecks = acceptableAnswers.map((ans) => (ans.toLowerCase() == givenAnswer.toLowerCase()));
    return answerChecks.reduce((acc, elem) => (acc || elem), false);
  }

  //determines how many points a user earns by the percentage of the question that was read at the time they buzzed
  static pointsFromCelerity(celerity) {
    return 10 + Math.floor(Math.sqrt(celerity) / 0.1);
  }

  //prepares an object to be the argument for a POST request to the server
  //the object represents contains all the metadata, question anwers, and audio to create the game on the backend
  static prepareGameData(title, description, questions) {
    return {
      title: title.trim(),
      description: description.trim(),
      questionCount: questions.length,
      questions:
        (questions.map((q) => 
          ({
            questionNumber: q.number,
            answers: q.answers.split(",").map((s) => (s.trim())),
            audioFile: q.audioFile
          })))
    }
  }

  // duplicates the validation of game data that occurs on the backend, to prevent unnecessary bandwidth usage
  static validateGameData(gameData) {
    console.log("Gamedata: ", gameData);
      
      if(!gameData.title || gameData.title.trim() === ""){
        throw "No title provided";
      }
      
      if(!gameData.description || gameData.description.trim() === ""){
        throw "No description provided";
      }
      
      if(!gameData.questionCount || gameData.questionCount === 0){
        throw "Can't create a game with zero questions";
      }

      if(!gameData.questions || gameData.questions.length === 0){
        throw "Can't create a game with zero questions";
     }
     
     gameData.questions.map((q) => {
       if(!q.answers || q.answers.length === 0 || (q.answers.length === 1 && q.answers[0] === '')){
         throw `Question #${q.questionNumber} has no answers provided`;
       }
       
       if(!q.audioFile) {
         throw `Question #${q.questionNumber} has no audio file provided`;
       }
     })
      
      return;
  }

  //accepts the output of prepareGameData and uploads it to the Parse server
  //and create a new game in the database
  static async uploadGame(gameData){


    try {
      this.validateGameData(gameData);
      const response = await Parse.Cloud.run("createGame", gameData);
      console.log("response: ", response);
      // upload was succesful: we now need to upload the audio files

      await gameData.questions.map(async (q) => {
        const query = new Parse.Query("Question");
        query.equalTo("gameID", response.newGameId).equalTo("questionNumber", parseInt(q.questionNumber));
        const responses = await query.find();

        const audioFile = new Parse.File(q.audioFile.name, q.audioFile);
        
        const savedFile = await audioFile.save();

        responses[0].set("audio", savedFile);

        await responses[0].save();


      })


    } catch (error) {
      alert(`error: ${error}`);
    }
  }


}

