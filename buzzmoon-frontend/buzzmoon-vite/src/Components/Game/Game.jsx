import * as React from "react"
import QuestionResult from "../QuestionResult/QuestionResult";
import QuestionSpeaker from "../QuestionSpeaker/QuestionSpeaker";
import './Game.css'

export default function Game(props) {
    let [gameID, setGameID] = React.useState(1); //placeholder
    let [questionNumber, setQuestionNumber] = React.useState(0);
    let [prevQuestionDetails, setPrevQuestionDetails] = React.useState(null);
    let [buzzTimings, setBuzzTimings] = React.useState({play:0, buzz:0, duration:0});
    let [answerInputText, setAnswerInputText] = React.useState("");
    let [readingMode, setReadingMode] = React.useState("waitfornxt");
        // modes are waitfornxt: wait for next question to be navigated to
        //           readactive: question audio is being read
        //           waitforstrt: wait for question audio to be read
        //           waitforans: wait for user to type answer to question

    const processAnswer = () => {
        fetch(`../../testdata/game-1/q${questionNumber}.json`)
            .then(response => (response.json()))
            .then(json => {
                //console.log('json: ', json);
                let celerity = Math.max(0,0, 1.0 - (buzzTimings.buzz-buzzTimings.play)/(1000*buzzTimings.duration));
                let givenAnswer = answerInputText;
                setPrevQuestionDetails(
                    {question:json, celerity:celerity, givenAnswer:givenAnswer});
            });
    }

    return (
        <div className="game">
            <div className="game-header">Question #{questionNumber}</div>

            <div className="game-body">
            <div className="input-controls">
                {(readingMode == "waitfornxt") && 
                    <button className="next-question" 
                        onClick={() => {
                            setReadingMode("waitforstrt");
                            setQuestionNumber(questionNumber+1);
                            }}>
                            Next
                    </button>}

                {(readingMode != "waitfornxt") && <QuestionSpeaker questionNumber={questionNumber} 
                    buzzTimings={buzzTimings} setBuzzTimings={setBuzzTimings} 
                    readingMode={readingMode} setReadingMode={setReadingMode}/>}

                {(readingMode == "waitforans") && 
                <form autoComplete="off" onSubmit={() => {
                    processAnswer();
                    setAnswerInputText("");
                    setReadingMode("waitfornxt");
                    }}>
                    <input type="text" name="answer-input" 
                        value={answerInputText} onChange={(event) => {
                            setAnswerInputText(event.target.value);
                        }}/>
                    <button type="submit">Submit</button>
                </form>}
            </div>
            
            {prevQuestionDetails && <QuestionResult results={prevQuestionDetails}/>}
            </div>
        </div>
    )
}