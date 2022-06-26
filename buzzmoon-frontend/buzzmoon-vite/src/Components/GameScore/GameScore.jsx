import * as React from 'react';
import './GameScore.css';

export default function GameScore(props) {
  return (
    <div className='game-score'>
      {` Score: ${props.cumulativeScore}`}
    </div>
  )
}