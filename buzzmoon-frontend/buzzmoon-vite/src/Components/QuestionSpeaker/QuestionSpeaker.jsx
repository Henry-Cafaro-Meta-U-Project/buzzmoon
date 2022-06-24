import * as React from "react"
import { useRef } from "react"
import './QuestionSpeaker.css'

export default function QuestionSpeaker(props) {

    let [isPlaying, setIsPlaying] = React.useState(false);

    let audioRef = React.useRef(new Audio(`../../testdata/game-1/q${props.questionNumber}.m4a`));

    React.useEffect(() => {
        audioRef.current = new Audio(`../../testdata/game-1/q${props.questionNumber}.m4a`);
    }, [props.questionNumber])

    const play = () => {
        setIsPlaying(true);
        audioRef.current.play();
        props.setBuzzTimings({...props.buzzTimings, duration:audioRef.current.duration, play:Date.now()});
        props.setReadingMode("readactive");
    }

    const buzz = () => {
        setIsPlaying(false);

        audioRef.current.pause();
        props.setBuzzTimings({...props.buzzTimings, duration:audioRef.current.duration, buzz:Date.now()});

        props.setReadingMode("waitforans");
    }

    return (
        <div className="question-speaker">
            
            {(props.readingMode == "waitforstrt") && <button onClick={play}>Play</button>}
            {(props.readingMode == "readactive") && <button onClick={buzz}>Buzz</button>}

        </div>
    )
}