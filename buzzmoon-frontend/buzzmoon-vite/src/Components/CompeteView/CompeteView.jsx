import * as React from 'react';
import './CompeteView.css';
import Game from '../Game/Game';
import Results from '../Results/Results';
import { BrowserRouter,
  Route,
  Routes,
  Navigate,
  Link } from 'react-router-dom';
import BackendActor from '../BackendActor/backend-actor';
import GameSplashPage from '../GameSplashPage/GameSplashPage';

//const gameIDs = [1, 2] //placeholder

export default function CompeteView() {
  let [games, setGames] = React.useState([]);

  React.useEffect(() => {
    const fetchGames = async () => {
      const games = await BackendActor.getGames();
      setGames(games);
    }
    
    fetchGames();
  }, []);


  return (
    <div className="compete-view">
      <Routes>
        <Route path="/" 
          element={
            <div className='compete-games'>

            
              <div className='game-list'>
                <h2>Available Games</h2>
                <div className='available-games-body'>
                  {games.map((e) => (
                    <GameListItem key={e.id} game={e}/>
                    // <div className='game-link' key={e.id}>
                    //   ID : {e.id} <Link to={`/compete/${e.id}`}> Enter</Link>
                    // </div>
                  ))}
                </div>
              </div>
              <div className='game-list'>
                <h2> Games Played </h2>
              </div>
            </div>}>
        </Route>
        <Route path="/:gameID" element={<GameSplashPage />}></Route>
        <Route path="/:gameID/play/:resultKey" element={<Game />}></Route>

        <Route path="/:gameID/results" element={<Results />}></Route>
      </Routes>
      
    </div>
  );
}


function GameListItem(props) {
  return  (
    <div className='game-list-item'>
      {props.game.attributes.title} <Link to={`/compete/${props.game.id}`}> Enter</Link>
    </div>
  )
}
