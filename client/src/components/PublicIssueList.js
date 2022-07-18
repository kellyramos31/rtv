import React from "react"
import PublicIssueText from './PublicIssueText.js'


export default function IssueList(props){

const { issues}  = props


return (

    <div className="public-issue-list">
       {issues.map(issue => <PublicIssueText {...issue} key={issue._id}/>)}
    </div>

  )
}