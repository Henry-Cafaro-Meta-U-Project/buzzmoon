import * as React from 'react';
import BackendActor from '../BackendActor/backend-actor';
import './QuestionSpeaker.css';

export default function QuestionSpeaker(props) {
  let [isLoading, setIsLoading] = React.useState("loading");
  
  const audioRef = React.useRef();

  React.useEffect(() => {
    const updateAudio = async () => {
      setIsLoading("loading");
      const audioURL = await BackendActor.getServerAudioURL(props.gameID, props.questionNumber);
      audioRef.current = await new Audio(audioURL);
      await audioRef.current.load();
      setIsLoading("ready");
    }

    updateAudio();
  }, [props.questionNumber]);


  const play = async () => {
    await audioRef.current.play();
    props.setBuzzTimings(
      { ...props.buzzTimings, duration: audioRef.current.duration, play: Date.now() },
    );
    props.setReadingMode('readactive');
  };

  const buzz = () => {
    audioRef.current.pause();
    audioRef.current.muted = true;
    props.setBuzzTimings(
      { ...props.buzzTimings, duration: audioRef.current.duration, buzz: Date.now() },
    );

    props.setReadingMode('waitforans');
  };


  return (
    <div className="question-speaker">

      {(isLoading === "loading") && <span className='loading-header'>
        <i className="fa-solid fa-spinner fa-spin"></i>
      </span>}
      {(props.readingMode === 'waitforstrt' && isLoading === "ready") && <button type="button" onClick={play}>Play</button>}
      {(props.readingMode === 'readactive' && isLoading === "ready") && <button type="button" onClick={buzz}>Buzz</button>}

    </div>
  );
}
