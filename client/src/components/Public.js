import React, { useContext, useEffect} from "react"
import PublicIssueList from "./PublicIssueList.js"
import { IssueCommentContext } from "../context/IssueCommentProvider.js"



export default function Public() {


      const {
        issueState,
        issues,
        userIssues,
        comments,
        getUserIssues,
        getIssues
    } = useContext(IssueCommentContext)


//USEEFFECT

  useEffect(() => {
    console.log("useEffect triggered")
    getUserIssues()
    getIssues()
    // eslint-disable-next-line  
  }, [issueState])




    return (
        <div className="public">
          <h3 className="title-public-page">all users' issues</h3>
            <PublicIssueList 
                issues={issues}
                userIssues={userIssues}
                comments={comments}
            />
        </div>
    )
}