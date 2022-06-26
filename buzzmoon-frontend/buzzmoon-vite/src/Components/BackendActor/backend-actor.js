export default class BackendActor {
  static getAudioURL(gameID, questionNumber){
    return `../../testdata/game-${gameID}/q${questionNumber}.m4a`;
  }

  // static getQuestionDataURL(gameID, questionNumber){
  //   return `../../testdata/game-${gameID}/q${questionNumber}.json`;
  // }

  static async getQuestionResults(gameID, questionNumber, givenAnswer, buzzTimings){
    const URL = `../../testdata/game-${gameID}/q${questionNumber}.json`;
    let returnObject = await fetch(URL)
                        .then((response) => (response.json()))
                        .then((json) => {
                          const celerity = Math.max(
                            0.0,
                            1.0 - (buzzTimings.buzz - buzzTimings.play) / (1000 * buzzTimings.duration),
                          );
                          const isCorrect = this.checkAnswerCorrectness(givenAnswer, json.answers);
                          return {question: json, celerity: celerity, points:(isCorrect ? this.pointsFromCelerity(celerity) : 0),
                                  givenAnswer: givenAnswer, isCorrect:isCorrect};
                        });
    return returnObject;
  }

  static checkAnswerCorrectness(givenAnswer, acceptableAnswers){
    let answerChecks = acceptableAnswers.map((ans) => (ans.toLowerCase() == givenAnswer.toLowerCase()));
    return answerChecks.reduce((acc, elem) => (acc || elem), false);
  }

  static pointsFromCelerity(celerity) {
    return 10 + Math.floor(Math.sqrt(celerity) / 0.1);
  }

}

