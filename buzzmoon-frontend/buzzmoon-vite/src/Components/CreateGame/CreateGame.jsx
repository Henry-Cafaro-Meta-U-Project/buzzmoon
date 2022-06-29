import * as React from 'react';
import './CreateGame.css';

export default function CreateGame() {
  let [title, setTitle] = React.useState("");
  let [desc, setDesc] = React.useState("");

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

        </div>
        
      </div>
      <div className='submit-details'>

      </div>
    </div>
  );
}