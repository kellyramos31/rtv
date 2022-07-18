import React, { useContext, useEffect } from "react"
import IssueForm from "./IssueForm.js"
import IssueList from "./IssueList.js"
// import CommentForm from "./CommentForm.js"
import { UserContext } from "../context/UserProvider.js"
import { IssueCommentContext } from "../context/IssueCommentProvider.js"

export default function Profile() {

    const {
    user: {
        username
    }
        
    } = useContext(UserContext)

    const {
        addIssue,
        issueState,
        userIssues,
        comments,
        getUserIssues,
        getIssues,
        deleteIssue,
        deleteComment
    } = useContext(IssueCommentContext)



//USEEFFECT

  useEffect(() => {
    console.log("useEffect triggered")
    getUserIssues()
    getIssues()
    // eslint-disable-next-line  
  }, [issueState])



return (

               <div className="profile">
                   
                    <h1 className="welcome-msg">welcome @{username}!</h1>

                    <IssueForm
                        addIssue={addIssue}
                    />

                    
                    <h2 className="profile-issues-list-header">{username}'s issues</h2>
                 <div className="issues-list">
                    <IssueList
                        deleteComment={deleteComment}
                        deleteIssue={deleteIssue}
                        userIssues={userIssues}
                        comments={comments}
                    />
                </div>
            </div>

        )
    }
