import * as React from 'react';
import './QuestionSpeaker.css';

export default function QuestionSpeaker(props) {
  const audioRef = React.useRef(new Audio(`../../testdata/game-1/q${props.questionNumber}.m4a`));

  React.useEffect(() => {
    audioRef.current = new Audio(`../../testdata/game-1/q${props.questionNumber}.m4a`);
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
