import * as React from 'react';
import QuestionResult from '../QuestionResult/QuestionResult';
import QuestionSpeaker from '../QuestionSpeaker/QuestionSpeaker';
import { useParams } from 'react-router-dom';
import BackendActor from '../BackendActor/backend-actor';
import './Game.css';
import GameScore from '../GameScore/GameScore';

export default function Game(props) {
  const {gameID} = useParams();

  const [questionNumber, setQuestionNumber] = React.useState(0);
  const [prevQuestionDetails, setPrevQuestionDetails] = React.useState(null);
  const [cumulativeScore, setCumulativeScore] = React.useState(0);
  const [cumulativeResults, setCumulativeResults] = React.useState([]);
  const [buzzTimings, setBuzzTimings] = React.useState({ play: 0, buzz: 0, duration: 0 });
  const [answerInputText, setAnswerInputText] = React.useState('');
  const [readingMode, setReadingMode] = React.useState('waitfornxt');
  // modes are waitfornxt: wait for next question to be navigated to
  //           readactive: question audio is being read
  //           waitforstrt: wait for question audio to be read
  //           waitforans: wait for user to type answer to question

  const processAnswer = async () => {
    let questionResults = await BackendActor.getQuestionResults(gameID, questionNumber, answerInputText, buzzTimings);
    setCumulativeScore(cumulativeScore + questionResults.points);
    setPrevQuestionDetails(questionResults);
  };

  return (
    <div className="game">
      <div className="game-header">
        <div className='game-question-number'>
          {`Question #${questionNumber}`}
        </div>
        <GameScore cumulativeScore={cumulativeScore}/>
      </div>

      <div className="game-body">
        <div className="input-controls">
          {(readingMode === 'waitfornxt')
                    && (
                    <button
                      type="button"
                      className="next-question"
                      onClick={() => {
                        setReadingMode('waitforstrt');
                        setQuestionNumber(questionNumber + 1);
                      }}
                    >
                      Next
                    </button>
                    )}

          {(readingMode !== 'waitfornxt') && (
          <QuestionSpeaker
            gameID={gameID}
            questionNumber={questionNumber}
            buzzTimings={buzzTimings}
            setBuzzTimings={setBuzzTimings}
            readingMode={readingMode}
            setReadingMode={setReadingMode}
          />
          )}

          {(readingMode === 'waitforans')
                && (
                <form
                  autoComplete="off"
                  onSubmit={() => {
                    processAnswer();
                    setAnswerInputText('');
                    setReadingMode('waitfornxt');
                  }}
                >
                  <input
                    type="text"
                    name="answer-input"
                    value={answerInputText}
                    onChange={(event) => {
                      setAnswerInputText(event.target.value);
                    }}
                  />
                  <button type="submit">Submit</button>
                </form>
                )}
        </div>

        {prevQuestionDetails && <QuestionResult results={prevQuestionDetails} />}
      </div>
    </div>
  );
}
