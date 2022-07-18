import React, { useState, useContext } from "react"
import { IssueCommentContext } from "../context/IssueCommentProvider.js"
import { FcCancel } from 'react-icons/fc'


const initInputs = {
  commentText: ""
}


export default function CommentForm(props){

const [inputs, setInputs] = useState(initInputs)

const { combinedAddComment } = useContext(IssueCommentContext)

const { toggleToComment, _issue} = props




function handleCommentChange(e){
    const {name, value} = e.target
    setInputs(prevInputs => ({
      ...prevInputs,
      [name]: value
    }))
    }

 function handleSubmitComment(e){
    e.preventDefault()
    //console.log("_issue:", _issue)
    console.log("inputs", inputs)
    // console.log("_issue", _issue)
    combinedAddComment(commentText, _issue)
    setInputs(initInputs)
    toggleToComment()
  }

const { commentText } = inputs



return (
    <div className="comment-form">
     <form onSubmit={(e)=>handleSubmitComment(e, commentText, _issue)}>
        <input
            _issue={_issue}
            type="text" 
            name="commentText" 
            value={commentText} 
            onChange={handleCommentChange} 
            placeholder="comment text"
        />
        <div className="comment-form-buttons">
            <button className="submit-comment-button">Submit Comment</button>
            <button className="cancel-comment-btn" onClick={toggleToComment}><FcCancel size={22} style={{ fill: "white"}}/></button>
        </div>
      </form>
    </div>
  )
}



