import * as React from 'react';
import './CreateQuestion.css';

export default function CreateQuestion(props) {
  let [questionAudio, setQuestionAudio] = React.useState();
  let [playingMode, setPlayingMode] = React.useState("no audio");
  // options are "no audio", "playing", "paused"

  

  React.useEffect(() => {
    if(props.question.audioFile) {
      const newAudio = new Audio(URL.createObjectURL(props.question.audioFile));
      newAudio.onended = () => {setPlayingMode("paused")};
      setQuestionAudio(newAudio);
      //console.log('URL.createObjectURL(props.question.audioFile: ', URL.createObjectURL(props.question.audioFile));
      //questionAudio.play();
    }

  }, [props.question.audioFile])
  

  const handleUploadFile = (e) => {
    setPlayingMode("paused");
    props.modifyQuestion(props.question.number, {...props.question, audioFile:(e.target.files[0])});
  }

  return (
    <div className='create-question'>
      <div className='create-question-header'>
        <div className='create-question-header-left'>
          Question #{props.question.number} 
        </div>
        <div className='create-question-header-center'>
          <div className='play-pause-widget'>
              {questionAudio && 
                (playingMode == "paused" ? 
                  <button type="button" className='play-audio' 
                    onClick={() => {
                      setPlayingMode("playing");
                      questionAudio.play()}}>
                    <i className="fa-solid fa-play"></i>
                  </button>
                  :
                  <button type="button" className='paused-audio' 
                    onClick={() => {
                      setPlayingMode("paused");
                      questionAudio.pause()}}>
                    <i className="fa-solid fa-pause"></i>
                  </button>
                )}
            </div>
          <div className='upload-audio-widget'>
            <input type='file' name='audio-file' accept=".mp3, .m4a" onChange={handleUploadFile} title="Choose an .mp3 or .m4a"></input>
          </div>
        </div>
        <div className='create-question-header-right'>
          <button type="button" name="delete-question-button" onClick={() => {
            props.deleteQuestion(props.question.number)
          }}>
            <i class="fa-solid fa-x"></i>
          </button>
        </div>        
        
      </div>
      <div className='create-question-answers'>
        <textarea name="answers" placeholder='Enter answers as a comma separated list, i.e: gold, aurum, pyrite'
          value={props.question.answers} onChange={(e) => {
            props.modifyQuestion(props.question.number, {...props.question, answers:(e.target.value)});
          }}></textarea>
      </div>
    </div>
  )
}
