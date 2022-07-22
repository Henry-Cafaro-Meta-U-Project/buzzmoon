export default class CheckAnswerEngine {

  // checks the correctness of a given answer by comparing to a list of acceptable answers
  static checkAnswerList(givenAnswer, acceptableAnswers) {
    let answerChecks = acceptableAnswers.map((ans) => (this.checkAnswer(givenAnswer, ans)));
    return answerChecks.reduce((acc, elem) => (acc || elem), false);
  }

  // removes accent marks, diacritics, punctuation, number words, etc. from a string for ease of comparison
  static cleanAnswer(ans) {
    const cleanAndTrim =
       ans.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "") //remove punctuation
          .replace(/\s{2,}/g, " ") //collapse whitespace
          .trim() // trim whitespace
          .toLowerCase() 
    return cleanAndTrim;
  }

  // checks the correctness of a given answer against a given correct answer
  static checkAnswer(given, correct){
    const fixedGiven = given.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
                            .replace
    return (this.cleanAnswer(given) === this.cleanAnswer(correct));
  }


}



