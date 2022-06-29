import * as React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import './CreateView.css';

import CreateGame from '../CreateGame/CreateGame';

export default  function CreateView(props) {
  return (
    <div className='create-view'>
      <Routes>
        <Route path="/" element={
          <div className='create-options'>
            <div className='game-list'>
              <h2>Your Games</h2>
              <div className='available-games-body'>
                Nothing found
              </div>
            </div>

            <Link to="/create/new">
              <button type="button" className='create-new-button'>
                <i class="fa-solid fa-plus"></i> Create New
              </button>
            </Link>
          </div>}>
        </Route>
        <Route path="/new" element={<CreateGame />}></Route>
      </Routes>
      
    </div>
  )
}