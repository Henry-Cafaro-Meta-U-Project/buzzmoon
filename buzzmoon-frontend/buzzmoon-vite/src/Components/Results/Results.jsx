import * as React from 'react';
import { useParams } from 'react-router-dom';
import BackendActor from '../BackendActor/backend-actor';
import './Results.css';

//placeholder results page
export default function Results(props) {
  const {gameID} = useParams();

  return (
    <div className='results'>
      {`Results of game# ${gameID}`}
    </div>
  )
}