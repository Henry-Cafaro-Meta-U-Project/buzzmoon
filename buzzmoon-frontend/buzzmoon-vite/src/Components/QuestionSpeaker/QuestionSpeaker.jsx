import * as React from 'react';
import BackendActor from '../BackendActor/backend-actor';
import './QuestionSpeaker.css';

export default function QuestionSpeaker(props) {
  
  const audioRef = React.useRef();

  React.useEffect(() => {
    const updateAudio = async () => {
      const audioURL = await BackendActor.getServerAudioURL(props.gameID, props.questionNumber);
      audioRef.current = new Audio(audioURL);
    }
    
    updateAudio();
  }, [props.questionNumber]);

  const play = () => {
    audioRef.current.play();
    props.setBuzzTimings(
      { ...props.buzzTimings, duration: audioRef.current.duration, play: Date.now() },
    );
    props.setReadingMode('readactive');
  };

  const buzz = () => {
    audioRef.current.pause();
    props.setBuzzTimings(
      { ...props.buzzTimings, duration: audioRef.current.duration, buzz: Date.now() },
    );

    props.setReadingMode('waitforans');
  };

  return (
    <div className="question-speaker">

      {(props.readingMode === 'waitforstrt') && <button type="button" onClick={play}>Play</button>}
      {(props.readingMode === 'readactive') && <button type="button" onClick={buzz}>Buzz</button>}

    </div>
  );
}
