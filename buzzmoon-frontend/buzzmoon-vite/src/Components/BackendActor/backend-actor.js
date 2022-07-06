import * as Parse from 'parse/dist/parse.min.js'

Parse.initialize('nUrzDufzLEaJ3sjzvcvNHvw1hD46jOt4yEipaWHs', 'juaO5lbdY5jTtDXGpzEr2mGtggC0wf2Es11cEruf');
Parse.serverURL = 'https://parseapi.back4app.com/';

export default class BackendActor {
  // handles the user login in the Auth component
  static async handleLogin(username, password, setCurrentUser) {
    try {
      const loggedInUser = await Parse.User.logIn(username, password);
      console.log(`Successful login: user ${loggedInUser.get(
        'username',
      )} has signed in`);

      setCurrentUser(loggedInUser);
      localStorage.setItem('user', loggedInUser);
    } catch (error) {
      alert(`error: ${error.message}`);
    }
  }

  // handles the user logout triggered by the logout button
  static async handleLogOut(setCurrentUser) {
    try {
      await Parse.User.logOut();
      setCurrentUser(null);
      localStorage.setItem('user', null);
    } catch (error) {
      console.log('error: ', error);
    }
  }

  // fetches the audio url of a question from the server
  static async getServerAudioURL(gameID, questionNumber) {
    const query = new Parse.Query('Question');
    query.equalTo('gameID', gameID).equalTo('questionNumber', parseInt(questionNumber));

    const responses = await query.find();
    const data = responses[0].attributes;

    return data.audio._url;
  }

  // fetches a list of available games
  static async getGames() {
    const query = new Parse.Query('Game');
    const responses = await query.find();
    return responses;
  }

  static async getQuestionResults(gameID, resultKey, questionNumber, givenAnswer, buzzTimings) {
    const response = await Parse.Cloud.run("getQuestionResults", {gameID, resultKey, questionNumber, givenAnswer, buzzTimings});
    return response;
  
  }

  // prepares an object to be the argument for a POST request to the server
  // the object represents contains all the metadata, question anwers, and audio to create the game on the backend
  static prepareGameData(title, description, questions) {
    return {
      title: title.trim(),
      description: description.trim(),
      questionCount: questions.length,
      questions:
        (questions.map((q) => ({
          questionNumber: q.number,
          answers: q.answers.split(',').map((s) => (s.trim())),
          audioFile: q.audioFile,
        }))),
    };
  }

  // duplicates the validation of game data that occurs on the backend, to prevent unnecessary bandwidth usage
  static validateGameData(gameData) {
    if (!gameData.title || gameData.title.trim() === '') {
      throw 'No title provided';
    }

    if (!gameData.description || gameData.description.trim() === '') {
      throw 'No description provided';
    }

    if (!gameData.questionCount || gameData.questionCount === 0) {
      throw "Can't create a game with zero questions";
    }

    if (!gameData.questions || gameData.questions.length === 0) {
      throw "Can't create a game with zero questions";
    }

    gameData.questions.map((q) => {
      if (!q.answers || q.answers.length === 0 || (q.answers.length === 1 && q.answers[0] === '')) {
        throw `Question #${q.questionNumber} has no answers provided`;
      }

      if(!q.audioFile) {
        throw `Question #${q.questionNumber} has no audio file provided`;
      }
    });
  }

  // accepts the output of prepareGameData and uploads it to the Parse server
  // and create a new game in the database
  static async uploadGame(gameData) {
    try {
      this.validateGameData(gameData);
      const response = await Parse.Cloud.run('createGame', gameData);

      await gameData.questions.map(async (q) => {
        const query = new Parse.Query('Question');
        query.equalTo('gameID', response.newGameId).equalTo('questionNumber', parseInt(q.questionNumber));
        const responses = await query.find();

        const audioFile = new Parse.File(q.audioFile.name, q.audioFile);

        const savedFile = await audioFile.save();

        responses[0].set('audio', savedFile);

        await responses[0].save();
      });

      return "Success";
    } catch (error) {
      alert(`error: ${error}`);
    }
  }

  static async getGameMetadata(gameID){
    if(gameID){
      const query = new Parse.Query("Game");
      const game = await(query.get(gameID));

      return game.attributes;
    }

  }

  static async checkEntryMode(gameID) {
    const response = await Parse.Cloud.run("checkEntryMode", {gameID});
    return response;
  }

  static async registerGameEntry(gameID) {
    const response = await Parse.Cloud.run("registerGameEntry", {gameID});
    return response;
  }

}
