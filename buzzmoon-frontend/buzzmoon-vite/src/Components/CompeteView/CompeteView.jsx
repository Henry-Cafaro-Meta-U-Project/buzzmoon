import * as React from 'react';
import './CompeteView.css';
import Game from '../Game/Game';
import { BrowserRouter,
  Route,
  Routes,
  Navigate,
  Link } from 'react-router-dom';

const gameIDs = [1, 2] //placeholder

export default function CompeteView() {
  return (
    <div className="compete-view">
      <Routes>
        <Route path="/" 
          element={
            <div className='available-games'>
              <h2>Available Games</h2>
              <div className='available-games-body'>
                {gameIDs.map((e) => (
                  <div className='game-link' key={e}>
                    ID : {e} <Link to={`/compete/${e}`}> Enter</Link>
                  </div>
                ))}
              </div>
            </div>}>
        </Route>
        <Route path="/:gameID" element={<Game />}></Route>
      </Routes>
      
    </div>
  );
}
