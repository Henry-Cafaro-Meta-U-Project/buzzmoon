import * as React from "react"
import QuestionResult from "../QuestionResult/QuestionResult";
import './Game.css'

export default function Game(props) {
    let [gameID, setGameID] = React.useState(1); //placeholder
    let [questionNumber, setQuestionNumber] = React.useState(1);
    let [prevQuestionDetails, setPrevQuestionDetails] = React.useState(null);

    return (
        <div className="game">
            <div className="question-number">{questionNumber}</div>
            
            <button className="next-question" 
                onClick={() => {
                    console.log('questionNumber: ', questionNumber);
                    fetch(`../../testdata/game-1/q${questionNumber}.json`)
                        .then(response => (response.json()))
                        .then(json => {
                            console.log('json: ', json);
                            setPrevQuestionDetails({question:json});
                        });
                    setQuestionNumber(questionNumber+1);
                    
                    }}></button>
            {(prevQuestionDetails ? 
                <QuestionResult results={prevQuestionDetails}/> : 
                null)}
        </div>
    )
}