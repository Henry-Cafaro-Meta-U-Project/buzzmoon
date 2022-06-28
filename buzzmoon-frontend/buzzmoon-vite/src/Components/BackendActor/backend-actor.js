import * as Parse from 'parse/dist/parse.min.js'

Parse.initialize(`nUrzDufzLEaJ3sjzvcvNHvw1hD46jOt4yEipaWHs`, `juaO5lbdY5jTtDXGpzEr2mGtggC0wf2Es11cEruf`);
Parse.serverURL = 'https://parseapi.back4app.com/';


export default class BackendActor {
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

  static async handleLogOut(setCurrentUser) {
    try {
      await Parse.User.logOut();
      setCurrentUser(null);
      localStorage.setItem('user', null);
    } catch (error) {
      console.log('error: ', error);
      
    }
  }

  static getAudioURL(gameID, questionNumber){
    return `../../testdata/game-${gameID}/q${questionNumber}.m4a`;
  }

  static async getQuestionResults(gameID, questionNumber, givenAnswer, buzzTimings){
    const query = new Parse.Query("Question");
    query.equalTo("gameID", parseInt(gameID)).equalTo("questionNumber", parseInt(questionNumber));


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

  static checkAnswerCorrectness(givenAnswer, acceptableAnswers){
    let answerChecks = acceptableAnswers.map((ans) => (ans.toLowerCase() == givenAnswer.toLowerCase()));
    return answerChecks.reduce((acc, elem) => (acc || elem), false);
  }

  static pointsFromCelerity(celerity) {
    return 10 + Math.floor(Math.sqrt(celerity) / 0.1);
  }

}

