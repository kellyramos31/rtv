import React from "react"
import IssueText from './IssueText.js'


export default function IssueList(props){

const { userIssues }  = props


return (
    
    <div className="user-issue-list">
       {userIssues.map(userIssue => <IssueText {...userIssue} key={userIssue._id}/>)}
    </div>
  )
}