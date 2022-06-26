export default class BackendActor {
  static getAudioURL(gameID, questionNumber){
    return `../../testdata/game-${gameID}/q${questionNumber}.m4a`
  }

  static getQuestionDataURL(gameID, questionNumber){
    return `../../testdata/game-${gameID}/q${questionNumber}.json`
  }

}

