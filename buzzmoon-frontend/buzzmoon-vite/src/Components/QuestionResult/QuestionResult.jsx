/* eslint-disable react/prop-types */
import * as React from 'react';
import './QuestionResult.css';

const formatConfig = {
  minimumFractionDigits: 3,
  maximumFractionDigits: 3,
};

const formatter = new Intl.NumberFormat('en-US', formatConfig);

function pointsFromCelerity(celerity) {
  return 10 + Math.floor(Math.sqrt(celerity) / 0.1);
}

export default function QuestionResult(props) {
  console.log('props: ', props);
  return (
    <div className="question-result">
      <div className="question-number">
        {'Result for Question # '}
        {props.results.question.questionNumber}
        {` : ${props.results.isCorrect ? "Correct" : "Incorrect"}`}
      </div>
      <div className="celerity">
        {'Celerity: '}
        {formatter.format(props.results.celerity)}
      </div>
      <div className="points">
        {'Points: '}
        {props.results.points}
      </div>
      <div className="given-answer">
        {'Given Answer: '}
        {props.results.givenAnswer}
      </div>
      <div className="answer-list">
        {'Acceptable Answers: '}
        {props.results.question.answers.join(', ')}
      </div>
    </div>
  );
}
