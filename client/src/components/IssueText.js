import React, { useState, useContext } from 'react'
import { IssueCommentContext } from "../context/IssueCommentProvider.js"
import { FcCancel } from 'react-icons/fc'
import {BsPeopleFill} from 'react-icons/bs'
import { BsArrowUpCircleFill} from 'react-icons/bs'
import { BsArrowDownCircleFill} from 'react-icons/bs'
import { FaComments } from 'react-icons/fa'



export default function IssueText(props){

    const {
        deleteIssue,
        editIssue,
    } = useContext(IssueCommentContext)



  const [toggleIsEditing, setToggleIsEditing] = useState(false)

  const [inputs, setInputs] = useState("")

  function toggleToEdit(){
    setToggleIsEditing(prev => !prev)
  }


  function handleEditChange(e){
    const {name, value} = e.target
    setInputs(prevInputs => ({
      ...prevInputs,
      [name]: value
    }))
    }

  

return (
    
   
    <div className="profile-container">

        
        <div key={props._id} className="user-issue-container">
            <div className="issue">
              <div className="my-profile-issue-tallies">
                <h3 className="total-votes"><BsPeopleFill size={20} style={{ fill: "rgb(253, 201, 31)"}}/> <span className="tallies-top">{props.totalVotersVotedCount}&nbsp;</span></h3>
                <h3 className="my-issue-upvotes"><BsArrowUpCircleFill size={20} style={{ fill: "rgb(253, 201, 31)"}}/><span className="tallies-top">{props.upVotes}&nbsp;</span></h3>
                <h3 className="my-issue-downvotes"><BsArrowDownCircleFill size={20} style={{ fill: "rgb(253, 201, 31)"}}/> <span className="tallies-top">{props.downVotes}&nbsp;</span></h3>
                <h3 className="my-issue-number-comments"><FaComments size={20} style={{ fill: "rgb(253, 201, 31)"}}/><span className="tallies-top">{props.numberCommentsOnIssue}&nbsp;</span></h3>
              </div>
              <div className="my-issue-descr-titles">
                <h1 className="issue-title-mine"><span className="my-issue-title">title</span> </h1>
                <h1 className="issue-title-mine-text">{props.title}</h1>
                <h3 className="issue-description-mine"><span className="my-issue-descr">description</span></h3> 
                <h3 className="issue-description-mine-text"><span className="my-descr-text">{props.description}</span></h3>
              </div>
                <div className="edit-delete-issue-buttons">
                  <button className="delete-issue-btn" onClick={() => deleteIssue(props._id)}>delete issue</button>
                  <button className="edit-issue-btn" onClick={toggleToEdit}>edit issue</button>
                </div>
            </div>
        
      
         { !toggleIsEditing ?
            <div>
              {null}
            </div>
          
      :
        <div className="outline-edit-issue-form" id={props._id} index={props.index} >
            <form className="edit-issue-form" onSubmit={()=>editIssue(inputs, props._id)}>
              <input
                type="text"
                defaultValue={props.title}
                inputs={props.title || inputs}
                name="title"
                onChange={handleEditChange}
                placeholder="Title"
              />
              <input
                type="text"
                defaultValue={props.description}
                inputs={props.description || inputs}
                name="description"
                onChange={handleEditChange}
                placeholder="Description"
              />
              <div className="edit-issue-form-btns">
                  <button className="submit-issue-edit-btn">submit edit</button>
                  <button className="cancel-issue-edit-btn" onClick={toggleToEdit}><FcCancel size={22} style={{ fill: "white"}}/></button>
              </div>
            </form>

        </div>
          }
   </div>
     </div>
)}
