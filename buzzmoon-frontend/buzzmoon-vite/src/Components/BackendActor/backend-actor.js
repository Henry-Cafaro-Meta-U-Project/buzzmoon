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

  // handles the signup of a new user in the Auth component
  static async handleSignup(email, password, realName, setCurrentUser) {
    try {
      const user = new Parse.User();
      user.set("username", email);
      user.set("password", password);
      user.set("email", email);
      user.set("realName", realName);

      await user.signUp();



      setCurrentUser(user);
      localStorage.setItem('user', user);

      console.log(`Successful login: user ${user.get(
        'username',
      )} has signed in`);

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

  // fetches a list of played games
  static async getPlayedGames() {
    const responses = await Parse.Cloud.run("fetchPlayedGames", {});
    return responses;
  }

  // fetches a list of created games
  static async getCreatedGames() {
    const responses = await Parse.Cloud.run("fetchCreatedGames", {});
    return responses;
  }

  // fetches a list of available games
  static async getGames() {
    //const query = new Parse.Query('Game');
    const responses = await Parse.Cloud.run("fetchAvailableGames", {});
    return responses;
  }

  static async getGame(gameID) {
    const gameData = await Parse.Cloud.run("fetchGameDataCloud", {gameID});
    return gameData;
  }

  // fetches a list of games corresponding to a query string
  static async searchGames(query) {
    const responses = await Parse.Cloud.run("searchGames", {query});
    return responses;
  }

  // registers the players answer in the backend database, and fetches the results of the question to show to the player
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

      if(!(q.audioFile.name.endsWith(".m4a") || q.audioFile.name.endsWith(".mp3"))){
        throw `The file associated with Question #${q.questionNumber} must be an .m4a or an .mp3`;
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

  // gets the metadata of a game given the game id
  static async getGameMetadata(gameID){
    if(gameID){
      const query = new Parse.Query("Game");
      const game = await(query.get(gameID));

      return game.attributes;
    }

  }

  // checks whether a player can play a game, or can only view results
  static async checkEntryMode(gameID) {
    const response = await Parse.Cloud.run("checkEntryMode", {gameID});
    return response;
  }

  // registers the entry of a player into a game on the backend
  // creates a GameResult object in database to hold the results of this game
  static async registerGameEntry(gameID) {
    const response = await Parse.Cloud.run("registerGameEntry", {gameID});
    return response;
  }

  // gets all GameResult objects in the database associated with a particular game
  static async fetchGameResults(gameID) {
    const response = await Parse.Cloud.run("fetchAllGameResults", {gameID});
    return response;
  }

  // takes an array of GameResults and constructs a table sorted by points scored
  static resultsToStandardTable(results){
    let rows = results.map(this.resultToStandardTableRow);

    rows.sort((a,b) => (b.points - a.points));

    return rows;
  }

  // takes the result data returned by a call to fetchGameResults and turns it into the data required for a table row
  // in the standard leaderboard
  static resultToStandardTableRow(result) {
    const points = result.answers.map((e) => (e.points)).reduce((acc, x) => (acc+x), 0);
    const numCorrect = result.answers.map((e) => (e.isCorrect ? 1 : 0)).reduce((acc, x) => (acc+x), 0);

    const averageCelerity = (result.answers.map((e) => (e.celerity)).reduce((acc, x) => (acc+x), 0)) / (result.answers.length);
    const name = result.name;
    return {points, numCorrect, averageCelerity, name};
  }

  // takes an array of gameresults and returns a table of best buzzes for a given game
  static resultsToBestBuzzesTable(results) {
    if(results.length === 0){
      return [];
    }

    const flatAnswerArray = results.map((e) => (e.answers.map((a) => ({...a, player:(e.name)})))).flat();

    const maxQuestionIndex = Math.max(...flatAnswerArray.map((e) => (e.questionNumber)));

    let response = new Array(maxQuestionIndex).fill(null);
    for (let i = 0; i < maxQuestionIndex; i++) {
      const questionAnswers = flatAnswerArray
                                .filter((e) => (e.questionNumber === i+1))
                                .filter((e) => (e.points > 0));

      if(questionAnswers.length > 0) {
        const bestBuzz = questionAnswers.reduce(
          (acc, curr) =>
            (acc.celerity > curr.celerity ? acc : curr), questionAnswers[0]);
        response[i] = bestBuzz;
      }
    }

    return response;
  }

  static resultsToHeadToHeadTable(results) {
    let response = []
    results.map((r) => {
      let w = 0;
      let l = 0;
      let t = 0;
      let outcomes = [];
      results.filter((e) => (e.name !== r.name)).map((o) => {
        let oscore = 0;
        let rscore = 0;
        const maxQuestionIndex = Math.max(...(o.answers).map((e) => (e.questionNumber)),
                                  ...(r.answers).map((o) => (o.questionNumber)));
        for(let i = 0; i < maxQuestionIndex; i++){
          let ocel = 0;
          let rcel = 0;
          const oans = o.answers.find((e) => (e.questionNumber === i+1));
          const rans = r.answers.find((e) => (e.questionNumber === i+1));
          if(oans && oans.points > 0){
            ocel = oans.celerity;
          }
          if(rans && rans.points > 0){
            rcel = rans.celerity;
          }
          if(ocel >= rcel && oans){
            oscore += oans.points ;
          }
          if(rcel >= ocel && rans){
            rscore += rans.points;
          }

        }


        if(oscore > rscore){
          l++;
          outcomes.push({oppName:o.name, res:"loss", score:rscore, oscore});
        } else if (oscore < rscore) {
          w++;
          outcomes.push({oppName:o.name, res:"win", score:rscore, oscore});
        } else{
          t++;
          outcomes.push({oppName:o.name, res:"tie", score:rscore, oscore});
        }
      })
      const games = w+l+t;
      const score = w + 0.5*t;
      response.push({name:r.name, w, l, t, percentage:score/games, outcomes});
    })
    return response.sort((a,b) => (a.percentage > b.percentage ? -1 : 1));
  }

}
