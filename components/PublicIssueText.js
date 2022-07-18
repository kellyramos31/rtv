import React, {useState, useContext} from "react"
import arrows from "../assets/andres-haro-R6ZJYwBzZx4-unsplash.jpg"
import CommentForm from "./CommentForm.js"
import CommentsOnIssue from "./CommentsOnIssue.js"
import { IssueCommentContext } from "../context/IssueCommentProvider.js"
// import { UserContext } from "../context/UserProvider.js"
import { BsArrowUpCircleFill} from 'react-icons/bs'
import { BsArrowDownCircleFill} from 'react-icons/bs'
import { FaEye} from 'react-icons/fa'
import { FaComments } from 'react-icons/fa'
import { BiHide } from 'react-icons/bi'
import {TiEquals} from 'react-icons/ti'
import {BsPeopleFill} from 'react-icons/bs'





export default function PublicIssueText(props){


const {
      voterUpVote,
      voterDownVote,
      calcNetVotes
     } = useContext(IssueCommentContext)


const [toggleIsCommenting, setToggleIsCommenting] = useState(false)

const [toggleIsViewingComments, setToggleIsViewingComments] = useState(false)




function toggleViewComments(){
    console.log("view comments toggled")
    setToggleIsViewingComments(prev => !prev)
  }

function toggleToComment(){
   console.log("toggleToComment clicked")
    setToggleIsCommenting(prev => !prev)
  }




return (
    <div className="all-issues-container" key={props._id}>
        <div className="all-issues" key={props._id}>
           
               <div className="tallies">
                    <h3 className="name-posted-by"><span className="posted-by">posted by </span><span className="user-name-span-issue">{props._user.username}</span></h3>   
                    <h3 className="total-votes-public"><BsPeopleFill size={21} style={{ fill: "rgb(253, 201, 31)"}}/><span className="tallies-top">{" "}{props.totalVotersVotedCount}&nbsp;</span></h3>
                    <h3 className="total-upVotes"><BsArrowUpCircleFill size={21} style={{ fill: "rgb(253, 201, 31)"}}/> <span className="tallies-top">{" "}{props.upVotes}&nbsp;</span></h3>
                    <h3 className="total-downVotes"><BsArrowDownCircleFill size={21} style={{ fill: "rgb(253, 201, 31)"}}/><span className="tallies-top">{" "}{props.downVotes}&nbsp;</span></h3>
                    <h3 className="net-votes"><TiEquals size={21} style={{ fill: "rgb(253, 201, 31)"}}/><span className="tallies-top">{" "}{calcNetVotes(props.upVotes, props.downVotes)}&nbsp; </span> </h3>
                    <h4 className="number-comments"><FaComments size={21} style={{ fill: "rgb(253, 201, 31)"}}/> <span className="tallies-top">{" "}{props.numberCommentsOnIssue}</span> </h4>
                </div>
            
            <h1 className="issue-title"><span className="title-issue">title</span></h1> 
            <h1 className="issue-title-text">{props.title}</h1>
            <h3 className="issue-description"><span className="descr-issue">description</span></h3> 
            <h3 className="issue-description-text">{props.description}</h3>

     
        <div className="comment-related-btns">
            <button className="up-vote-btn" onClick={() =>voterUpVote(props._id)}> <BsArrowUpCircleFill size={25} style={{ fill: "#0F4C75"}}/></button>
            <button className="down-vote-btn" onClick={()=>voterDownVote(props._id)}> <BsArrowDownCircleFill size={25} style={{ fill: "#0F4C75"}}/></button>
            <img className="arrows" src={arrows} alt="arrows" width="26%" height="30%"/>

      
        { !toggleIsCommenting ?
              <div id={props._id}>
                <button className="leave-comment-btn" onClick={toggleToComment}><FaComments size={25} style={{ fill: "white"}}/> leave comment</button>
              </div>
              :
              <div id={props._id} className="comment-form" >
                  <CommentForm
                    _issue={props._id}
                    toggleToComment={toggleToComment}
                  />
              
              </div>
          }
           </div>
               { !toggleIsViewingComments 
               
               ?
                <div>
                  <button className="see-comments-btn" key={props._id} onClick={toggleViewComments}> <div className="eye-btn-pieces"><FaEye size={25} style={{ fill: "#0F4C75"}}/>view comments</div></button>
                </div>
                :
                <div>
                <button  className="hide-comments-btn" onClick={toggleViewComments}><BiHide size={25} style={{ fill: "#0F4C75"}}/>hide comments</button>    

                    <CommentsOnIssue
                        _comments={props._comments}
                    />

          </div>
        }
    </div>
    </div>
)}


