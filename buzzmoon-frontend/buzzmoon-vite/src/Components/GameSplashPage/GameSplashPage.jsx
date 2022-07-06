import * as React from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import BackendActor from '../BackendActor/backend-actor';
import './GameSplashPage.css';

export default function GameSplashPage() {
  const {gameID} = useParams();
  const navigate = useNavigate();


  const [enterMode, setEnterMode] = React.useState("loading");

  React.useEffect(() => {
    const checkEntryMode= async () => {
      const response = await BackendActor.checkEntryMode(gameID);

      setEnterMode(response.mode);
    }

    checkEntryMode();
  }, []);


  return (
    <div className='game-splash-page'>
      {enterMode === "loading" && <i class="fa-solid fa-spinner fa-spin"></i>}
      {enterMode === "play" && <button type="button" onClick={() => {navigate("./play");}}>Enter</button>}
      {enterMode === "results" && <button type="button" onClick={() => {navigate("./results");}}>Enter</button>}
    </div>
  )
}