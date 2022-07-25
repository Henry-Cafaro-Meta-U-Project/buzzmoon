export default class ResultsEngine {
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