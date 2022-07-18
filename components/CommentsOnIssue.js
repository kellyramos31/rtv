import React, {useState, useContext} from "react"
import { FaEdit } from 'react-icons/fa'
import { RiDeleteBin6Fill} from 'react-icons/ri'
import {BsArrowUpCircleFill, BsArrowDownCircleFill} from 'react-icons/bs'
import EditCommentForm from "./EditCommentForm.js"
import { UserContext} from "../context/UserProvider.js"
import { IssueCommentContext } from "../context/IssueCommentProvider.js"



export default function CommentsOnIssue(props){

    const {
        _comments
    } = props
 
    const {
    user: {
        username
    },
        
    } = useContext(UserContext)

    const {
      calcNetVotes,
      commentUpVote,
      commentDownVote,
      deleteComment
     } = useContext(IssueCommentContext)


    const [isEditing, setIsEditing] = useState("")   
 



function toggleToEdit(index, id, _post){
    console.log("toggleToEdit index", index)
    console.log("toggleToEdit postComment._id", id)
    console.log("toggleToEdit clicked!")
    setIsEditing(id)
    console.log("isEditing", isEditing)
  }

 
    
return(

        <div className="public-comments-container">
            <h3 className="public-comments">comments
                {_comments.map((_comment, index)=> 
                                             
                         <li key={_comment._id} id={_comment._id} index={index} className="comment-list-item">

                        <div className="comment-vote-group-btns">
                            <button className="upvote-comment-btn" onClick={()=>commentUpVote(_comment._id)}><BsArrowUpCircleFill size={14} style={{ fill: "#0F4C75"}}/></button>
                            <button className="downvote-comment-btn" onClick={()=>commentDownVote(_comment._id)}><BsArrowDownCircleFill size={14} style={{ fill: "#0F4C75"}}/></button>
                        </div>

                        <span className="user-name-span-comment">{_comment._user.username}</span> 
                        {_comment.commentText}<span className="comment-votes-span">up:</span><span className="comment-tallies">{_comment.upVotesComments}</span>
                        <span className="comment-votes-span">down:</span><span className="comment-tallies">{_comment.downVotesComments}</span>
                        <span className="comment-votes-span">net:</span><span className="comment-tallies">{calcNetVotes(_comment.upVotesComments, _comment.downVotesComments)}{" "}</span>

                
              
           {username === _comment._user.username 
            ? 

            <div key={index} id={_comment._id} className="edit-del-comment-btns"> 
                        <div className="edit-del-btns-group">
                           <button className="delete-comment-btn" onClick={() => deleteComment(_comment._id, _comment._issue)}><RiDeleteBin6Fill size={15} style={{ fill: "royalblue"}}/></button>
                           <button className="edit-comment-btn" onClick={()=>toggleToEdit(index, _comment._id, _comment._issue)}><FaEdit size={15} style={{ fill: "royalblue"}}/></button> 
                         </div>
            </div>            
          :
         <div key={index} id={_comment._id}>
             {null}    
        </div>    
       }  
                  
                        
                         
            {isEditing ===_comment._id
            ?
               
                <div key={index} id={_comment._id} className="comment-edit-form">
                  &nbsp;
                  <EditCommentForm
                    key={_comment._id}
                    id={_comment._id}
                    _comment={_comment}
                    toggleToEdit={toggleToEdit}
                />
               </div>
                :
            <div>
                {null}
            </div>
            }          

            </li>
                )}                
            </h3>
 </div>
)}
 
