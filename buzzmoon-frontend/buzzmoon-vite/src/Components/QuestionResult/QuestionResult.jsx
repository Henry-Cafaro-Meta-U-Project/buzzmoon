import * as React from "react"
import './QuestionResult.css'

export default function QuestionResult(props) {
    return (
        <div className="question-result">
            Question Number:{props.results.question.questionNumber} <br />
            Celerity:{props.results.celerity} <br />
            <div className="answer-list">
                {props.results.question.answers}
            </div>
        </div>
    )
}