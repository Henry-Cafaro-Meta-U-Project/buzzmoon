import * as React from 'react';
import BackendActor from '../BackendActor/backend-actor';
import CreateQuestion from '../CreateQuestion/CreateQuestion';
import './CreateGame.css';

let uniqueQuestions = 0;

// this function used for the purpose of giving each question box a unique key
// so React preserves state correctly
const getUniqueKey = () => {
  uniqueQuestions += 1;
  return uniqueQuestions;
};

export default function CreateGame() {
  const [title, setTitle] = React.useState('');
  const [desc, setDesc] = React.useState('');
  const [questions, setQuestions] = React.useState([]);

  const deleteQuestion = (questionNumber) => {
    setQuestions(questions.filter((e) => (e.number !== questionNumber))
      .map((e, idx) => ({ ...e, number: idx + 1 })));
  };

  const modifyQuestion = (questionNumber, newQuestion) => {
    setQuestions(questions.filter((e) => (e.number !== questionNumber))
      .concat([newQuestion])
      .sort((a, b) => (a.number < b.number ? -1 : 1)));
  };

  return (
    <div className="create-game">
      <div className="game-details">
        <h2>Game Info</h2>
        Title:
        {' '}
        <input
          type="text"
          name="title"
          placeholder="Enter Title"
          value={title}
          onChange={(e) => { setTitle(e.target.value); }}
        />
        {' '}
        <br />
        Description:
        {' '}
        <br />
        <textarea
          name="description"
          placeholder="Enter Description"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
      </div>
      <div className="question-box">
        <h2>Questions</h2>
        <div className="question-list">
          {questions.map((q) => (
            <CreateQuestion
              key={q.id}
              question={q}
              questions={questions}
              setQuestions={setQuestions}
              deleteQuestion={deleteQuestion}
              modifyQuestion={modifyQuestion}
            />
          ))}
        </div>
        <button
          type="button"
          className="add-question-button"
          onClick={() => {
            setQuestions(questions.concat(
              [
                {
                  id: getUniqueKey(),
                  number: questions.length + 1,
                  answers: '',
                  audioFile: null,
                },
              ],
            ));
          }}
        >
          New Question
        </button>

      </div>
      <div className="submit-details">
        <button type="button" name="upload-game-button" 
          onClick={() => {
            //console.log(BackendActor.prepareGameData(title,desc,questions));
            BackendActor.uploadGame(BackendActor.prepareGameData(title, desc, questions));
          }}>
          Upload to Server
        </button>
      </div>
    </div>
  );
}
