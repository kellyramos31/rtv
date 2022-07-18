import React, {useState, useContext} from "react"
import { IssueCommentContext } from "../context/IssueCommentProvider.js"
import { FcCancel } from 'react-icons/fc'



export default function EditCommentForm(props){

const {
      editComment
     } = useContext(IssueCommentContext)

const [inputsCommentEdit, setInputsCommentEdit] = useState("")

const {id, _comment, toggleToEdit } = props


function handleChangeEdit(e){
    const {name, value} = e.target
    setInputsCommentEdit(prevInputs => ({
      ...prevInputs,
      [name]: value
    }))
    }



return(


                           <div key={props._id} index={props.index}>
                                    <form className="edit-comment-form" onSubmit={()=>editComment(inputsCommentEdit, id)}>
                                                <input
                                                     type="text"
                                                     defaultValue={_comment.commentText}
                                                     inputs={_comment.commentText || inputsCommentEdit}
                                                     name="commentText"
                                                     onChange={handleChangeEdit}
                                                     placeholder="comment text"
                                                 />
                                                <div className="edit-comments-grp-btns">
                                                    <button className="submit-edited-comment-btn">Submit Edit</button>
                                                    <button className="cancel-edit-comment-btn" onClick={toggleToEdit}><FcCancel size={18} style={{ fill: "white"}}/></button>
                                                </div>
                                        </form>
                            </div>  


)
}