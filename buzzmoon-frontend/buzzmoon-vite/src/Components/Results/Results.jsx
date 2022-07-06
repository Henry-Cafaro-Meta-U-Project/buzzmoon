import * as React from 'react';
import { useParams } from 'react-router-dom';
import BackendActor from '../BackendActor/backend-actor';
import './Results.css';

//placeholder results page
export default function Results(props) {
  const {gameID} = useParams();
  const [gameData, setGameData] = React.useState();
  const [resultsCat, setResultsCat] = React.useState("normal");
  const [table, setTable] = React.useState([]);

  React.useEffect(() => {
    const updateGameData = async () => {
      const fetchedGameData = await BackendActor.getGameMetadata(gameID);
      setGameData(fetchedGameData);
      

      // here we should validate if the user has played the game, or if they should be kicked from results page

      const playerResults = await BackendActor.fetchGameResults(gameID);
      const table = BackendActor.resultsToStandardTable(playerResults);
      console.log("🚀 ~ file: Results.jsx ~ line 23 ~ updateGameData ~ table", table)
      setTable(table);    
    }

    updateGameData();
  }, []);

  
  if (! gameData) {
    return (
      <div className='results'>
        <i className="fa-solid fa-spinner fa-spin"></i>
      </div>
    )
  }

  return (
    <div className='results'>
      <div className='game-results-header'>
        <h1>{`${gameData.title}`}</h1>
      </div>
      <div className='game-results-categories'>
      
      </div>
      <div className='game-results-table'>
        <table className='results-table'>
          <thead>
          <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>Points</th>
            <th># Correct</th>
          </tr>
          </thead>
          <tbody>
          {table.map((e, idx) => (
            <tr key={idx}>
              <td>{idx+1}</td>
              <td>{e.name}</td>
              <td>{e.points}</td>
              <td>{e.numCorrect}</td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}