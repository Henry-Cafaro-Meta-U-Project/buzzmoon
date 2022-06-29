import * as React from 'react';
import './CreateQuestion.css';

export default function CreateQuestion(props) {
  return (
    <div className='create-question'>
      <div className='create-question-header'>
        <div className='create-question-header-left'>
          Question #{props.question.number} 
        </div>
        <div className='create-question-header-right'>
          <button type="button" name="delete-question-button" onClick={() => {
            props.deleteQuestion(props.question.number)
          }}>
            <i class="fa-solid fa-x"></i>
          </button>
        </div>        
        
      </div>
      <div className='create-question-answers'>
        <textarea name="answers" placeholder='Enter answers as a comma separated list, i.e: gold, aurum, pyrite'
          value={props.question.answers} onChange={(e) => {
            props.modifyQuestion(props.question.number, {...props.question, answers:(e.target.value)});
          }}></textarea>
      </div>
    </div>
  )
}
