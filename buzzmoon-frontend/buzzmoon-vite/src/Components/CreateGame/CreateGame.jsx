import * as React from 'react';
import CreateQuestion from '../CreateQuestion/CreateQuestion';
import './CreateGame.css';

export default function CreateGame() {
  let [title, setTitle] = React.useState("");
  let [desc, setDesc] = React.useState("");
  let [questions, setQuestions] = React.useState([]);

  const deleteQuestion = (questionNumber) => {
    setQuestions(questions.filter((e) => (e.number !== questionNumber)).map((e, idx) => ({...e, number:idx+1})));
  }

  const modifyQuestion = (questionNumber, newQuestion) => {
    setQuestions(questions.filter((e) => (e.number !== questionNumber))
                          .concat([newQuestion])
                          .sort((a,b) => (a.number < b.number ? -1 : 1)));
  }

  return (
    <div className='create-game'>
      <div className='game-details'>
        <h2>Game Info</h2>
        Title: <input type="text" name="title" placeholder='Enter Title' value={title}
          onChange={(e) => {setTitle(e.target.value)}}></input> <br />
        Description: <br />
        <textarea name="description" placeholder='Enter Description' value={desc}
          onChange={(e) => setDesc(e.target.value)}></textarea>
      </div>
      <div className='question-box'>
        <h2>Questions</h2>
        <div className='question-list'>
          {questions.map((q, ind) => (
            <CreateQuestion key={ind} question={q} questions={questions} setQuestions={setQuestions} 
              deleteQuestion={deleteQuestion} modifyQuestion={modifyQuestion}/>
          ))}
        </div>
        <button type="button" className='add-question-button' onClick={() => {
          setQuestions(questions.concat(
            [{
              number:questions.length+1,
              answers:""}]));
        }}>New Question</button>
        
      </div>
      <div className='submit-details'>

      </div>
    </div>
  );
}