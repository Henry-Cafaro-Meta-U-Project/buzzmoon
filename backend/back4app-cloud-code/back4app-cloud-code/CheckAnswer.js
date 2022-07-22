export default class CheckAnswerEngine {

  // checks the correctness of a given answer by comparing to a list of acceptable answers
  static checkAnswerList(givenAnswer, acceptableAnswers) {
    let answerChecks = acceptableAnswers.map((ans) => (this.checkAnswer(givenAnswer, ans)));
    return answerChecks.reduce((acc, elem) => (acc || elem), false);
  }

  // replaces number words with the correct number, to standardize answer format
  static replaceNumber(word){
    if(["one", "first", "i"].includes(word)) return "1"
    if(["two", "second", "ii"].includes(word)) return "2"
    if(["three", "third", "iii"].includes(word)) return "3"
    if(["four", "fourth", "iv"].includes(word)) return "4"
    if(["five", "fifth", "v"].includes(word)) return "5"
    if(["six", "sixth", "vi"].includes(word)) return "6"
    if(["seven", "seventh", "vii"].includes(word)) return "7"
    if(["eight", "eighth", "viii"].includes(word)) return "8"
    if(["nine", "ninth", "ix"].includes(word)) return "9"
    if(["tem", "tenth", "x"].includes(word)) return "10"
    if(["eleven", "eleventh", "xi"].includes(word)) return "11"
    if(["twelve", "twelfth", "xii"].includes(word)) return "12"
    if(["thirteen", "thirteenth", "xiii"].includes(word)) return "13"
    if(["fourteen", "fourteenth", "xiv"].includes(word)) return "14"
    if(["fifteen", "fifteenth", "xv"].includes(word)) return "15"
    if(["sixteen", "sixteenth", "xvi"].includes(word)) return "16"
    return word
  }

  // strips out stopwords and semantically meaningless words that should not be considered in answer correctness
  static isStopword(word){
    return "the on of is a in on that have for at so it do or by and".split(" ").includes(word);
  }

  // removes accent marks, diacritics, punctuation, number words, etc. from a string for ease of comparison
  static cleanAnswer(ans) {
    const cleanAndTrim =
       ans.replace(/[.,\/#!$%\^&\*;:{}=\-_'`~()]/g, "") //remove punctuation
          .replace(/\s{2,}/g, " ") //collapse whitespace
          .trim() // trim whitespace
          .toLowerCase() 
    const replaced = cleanAndTrim
                      .split(" ")
                      .map((word) => this.replaceNumber(word))
                      .filter((word) => (!this.isStopword(word)))
                      .join(" ");
    return replaced;
  }

  // returns the levenshtein edit distance between two string
  static levenshtein(first, second) {
    const m = first.length;
    const n = second.length;
    let dp = []  // dp[i][j] gives the lev distance between first[:i] and second[:j]
    for(let i = 0; i < m+1; i++){
      dp.push(new Array(n+1).fill(0));
    }

    for(let i = 1; i < m+1; i++) {
      dp[i][0] = i;
    }

    for(let i = 1; i < n+1; i++) {
      dp[0][i] = i;
    }

    for(let i = 1; i < m+1; i++){
      for(let j = 1; j < n+1; j++){
        dp[i][j] = Math.min(1 + dp[i-1][j], 1 + dp[i][j-1], dp[i-1][j-1] + ((first[i-1] === second[j-1]) ? 0 : 1))
      }
    }

    return dp[m][n];

  }

  // checks the correctness of a given answer against a given correct answer
  static checkAnswer(given, correct){
    const givenClean = this.cleanAnswer(given);
    const correctClean = this.cleanAnswer(correct);
    const maxLen = Math.max(givenClean.length, correctClean.length);
    
    return (this.levenshtein(givenClean, correctClean) / maxLen < 0.25);
  }


}



module.exports = CheckAnswerEngine