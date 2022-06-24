import * as React from "react"
import QuestionResult from "../QuestionResult/QuestionResult";
import QuestionSpeaker from "../QuestionSpeaker/QuestionSpeaker";
import './Game.css'

export default function Game(props) {
    let [gameID, setGameID] = React.useState(1); //placeholder
    let [questionNumber, setQuestionNumber] = React.useState(0);
    let [prevQuestionDetails, setPrevQuestionDetails] = React.useState(null);
    let [buzzTimings, setBuzzTimings] = React.useState({play:0, buzz:0, duration:0});
    let [readingMode, setReadingMode] = React.useState("waitfornxt");

    return (
        <div className="game">
            <div className="question-number">{questionNumber}</div>
            {(readingMode == "waitfornxt") ? 
                <button className="next-question" 
                    onClick={() => {
                        fetch(`../../testdata/game-1/q${questionNumber}.json`)
                            .then(response => (response.json()))
                            .then(json => {
                                //console.log('json: ', json);
                                let celerity = Math.max(0,0, 1.0 - (buzzTimings.buzz-buzzTimings.play)/(1000*buzzTimings.duration));
                                setPrevQuestionDetails(
                                    {question:json, 
                                        celerity:celerity});
                            });
                        setReadingMode("waitforstrt");
                        setQuestionNumber(questionNumber+1);
                        
                        }}>Next</button> : null}

            {(readingMode != "waitfornxt") && <QuestionSpeaker questionNumber={questionNumber} 
                buzzTimings={buzzTimings} setBuzzTimings={setBuzzTimings} 
                readingMode={readingMode} setReadingMode={setReadingMode}/>}
            
            {prevQuestionDetails && <QuestionResult results={prevQuestionDetails}/>}
        </div>
    )
}