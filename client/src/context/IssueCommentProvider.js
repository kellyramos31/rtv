import React, { useState } from "react"
import axios from "axios"


export const IssueCommentContext = React.createContext({})

const userAxios = axios.create()

userAxios.interceptors.request.use(config => {
    const token = localStorage.getItem("token")
    config.headers.Authorization = `Bearer ${token}`
    return config
})

export default function IssueCommentProvider(props) {

        const initState = {
        user: JSON.parse(localStorage.getItem("user")) || {},
        token: localStorage.getItem("token") || "",
        userIssues: [],
        issues: [],
        comments: [],
        errMsg: ""
    }

const [issueState, setIssueState] = useState(initState)



function getIssues(){
        userAxios.get("/api/issue")
        .then(res => {
            console.log("res from issueCommentProvider:", res)
            setIssueState(prevState => ({
                ...prevState,
                issues: res.data
            }))

             console.log("issues from getIssues", res.data)
        })
        .catch(err => console.log(err.response.data.errMsg))
    }



// function sortCommentsForIssue() {
//     userAxios.get("/api/issue/sortComments")
//     .then(res => {
//             console.log("res from issueCommentProvider:", res)
//             setIssueState(prevState => ({
//                 ...prevState,
//                 issues: res.data
//             }))

//              console.log("issues from getIssues", res.data)
//         })
//         .catch(err => console.log(err.response.data.errMsg))

// }


 //GET USER'S INDIVIDUAL ISSUES   

function getUserIssues(){
  userAxios.get("/api/issue/user")
    .then(res => {
      console.log(res)
      setIssueState(prevState => ({
        ...prevState,
        userIssues: res.data
      }))
      console.log("userIssues from getUserIssues", res.data)
    })
    .catch(err => console.log(err.response.data.errMsg))
  }


//GET ALL COMMENTS (regardless of user)
function getComments(){
        userAxios.get("/api/comment")
        .then(res => {
            console.log(res)
            setIssueState(prevState => ({
                ...prevState,
                comments: res.data
            }))
            console.log("comments from getComments", res.data)
        })
        .catch(err => console.log(err.response.data.errMsg))

}
    
//GET ALL USER COMMENTS
    // function getUserComments(){
    //     userAxios.get("/api/comment/user")
    //     .then(res => {
    //         console.log(res)
    //         setUserState(prevState => ({
    //             ...prevState,
    //             comments: res.data
    //         }))
    //     })
    //     .catch(err => console.log(err.response.data.errMsg))
    // }



//ADD ISSUE
    function addIssue(newUserIssue) {
        userAxios.post("/api/issue", newUserIssue)
          .then(res => {
            console.log(res)
            setIssueState(prevState => ({
                ...prevState,
                issueState:  [...prevState.userIssues, res.data]
            }))
        })
        .catch(err=>console.log(err.response.data.errMsg))
    }

    


//DELETE ISSUE
function deleteIssue(issueId) {
        console.log("issueId:", issueId)
        userAxios.delete(`/api/issue/${issueId}`)
             .then(res => {
                setIssueState(prevState=> ({userIssues: prevState.userIssues.filter(userIssue => userIssue._id !== issueId)}))
                getIssues()
             })
        
            .catch(err=>console.log(err.response.data.errMsg))
    }


//EDIT USER'S ISSUE
    function editIssue(inputs, issueId) {
        console.log("issueId to be edited", issueId)
        console.log("inputs for edit", inputs)
        userAxios.put(`/api/issue/${issueId}`, inputs)
         .then(res => {
            setIssueState(prevState => prevState.userIssues.map(userIssue => userIssue._id !== issueId ? userIssue : res.data))
      })
      .catch(err=>console.log(err.response.data.errMsg))
    }

 
//COMBINED ADD COMMENT
function combinedAddComment (commentText, _issue){
  addComment(commentText, _issue)
  addCommentTally(_issue)
}

//ADD COMMENT
   function addComment(commentText, _issue) {
      const commentAdd = {
        commentText: commentText,
        _issue: _issue
      }
      // const _issue = issueId
      console.log("commentAdd:", commentAdd)
      // console.log("adding comment -- issueId:", issueId)
      userAxios.post("/api/comment", commentAdd)
         
        .then(res => {
            console.log("addComment res", res)
            setIssueState(prevState => ({
                ...prevState,
                issueState:  [...prevState.issues, res.data]
            })
              )})
        .catch(err=>console.log(err.response.data.errMsg))
    }


//INCREMENT COMMENT TOTAL ON SPECIFIC ISSUE
function addCommentTally (issueId) {
    console.log("_issue from addCommentTally:", issueId)
    userAxios.put(`/api/issue/increment/${issueId}`, issueId)
    .then(res => {
            console.log("addComment res", res)
            setIssueState(prevState => ({
                ...prevState,
                issueState:  [...prevState.issues, res.data]
            })
              )})
            
        .catch(err=>console.log(err.response.data.errMsg))
        
} 



//DELETE USER'S COMMENT (this deletes the comment record, decrements the comment tally on the issue & deletes the _comments ref in the post record)
    function deleteComment(commentId, issueId) {
        console.log("issueId:", issueId)
        console.log("commentId:", commentId)
        userAxios.delete(`/api/comment/${commentId}`)
             .then(res => {
                setIssueState(prevState=> ({issues: prevState.issues.filter(issue=> issue._comment !== commentId)}))
                deleteCommentFromIssueArray(commentId, issueId)
                minusCommentTally(issueId)
             })
        
            .catch(err=>console.log(err.response.data.errMsg))
    }


 //DELETE COMMENT FROM ARRAY of comments ids (_comments) in the issue -- route works in Postman by itself
 function deleteCommentFromIssueArray(commentId, issueId) {

     const _issue = {
       _issue: issueId
   }

    console.log("comment._id to delete:", commentId)
    console.log("issue to update the comments array in:", issueId)
    userAxios.put(`/api/comment/deleteCommentFromIssue/${commentId}`, _issue)
            // console.log("commentId:", commentId)
         .then(res => {
            console.log("getting rid of _comments id ref in issue collection")
            // setPostState(prevState => prevState.posts.map(post => post._id !== postId ? post : res.data))
      })
            
    .catch(err=>console.log(err.response.data.errMsg))
}


//DECREMENT COMMENT TOTAL ON SPECIFIC ISSUE
function minusCommentTally (issueId) {
    console.log("_issue from minusCommentTally:", issueId)
    userAxios.put(`/api/issue/decrement/${issueId}`)
    .then(res => {
            console.log("minusComment res", res)
            setIssueState(prevState => ({
                ...prevState,
                issueState:  [...prevState.issues, res.data]
            })
           
              )})
            
        .catch(err=>console.log(err.response.data.errMsg))
        
} 



//CALCULATE NET VOTES (NETVOTES = upVotes - downVotes)
function calcNetVotes(upVotes, downVotes){
  console.log("upVotes", upVotes)
  console.log("downVotes", downVotes)
  const net = upVotes - downVotes
  return net
}
  


//EDIT COMMENT
   function editComment(inputs, commentId){
        console.log("commentId to be edited", commentId)
        console.log("inputs for edit", inputs)
        userAxios.put(`/api/comment/${commentId}`, inputs)
         .then(res => {
            
            setIssueState(prevState => prevState.issues.map(issue => issue._comment !== commentId ? issue.userComment : res.data))
      })
      .catch(err=>console.log(err.response.data.errMsg))
    }




//UPVOTE AN ISSUE
function upVote(issueId){
  console.log("issueId for upVote:", issueId)
  userAxios.put(`/api/issue/upvote/${issueId}`)		
    .then(res => {
      console.log("upVote res:", res)
          setIssueState(prevState => ({
                ...prevState,
                issueState:  [...prevState.userIssues, res.data]
            }))
    })
   
    .catch(err => console.log(err.response.data.errMsg))
  }

//UPVOTE with limit of 1 (using _voters)--this uses $addToSet, so will only add if not already there
 function voterUpVote(issueId){
  console.log("issueId for upVote:", issueId)
  userAxios.put(`/api/issue/voter/vote/${issueId}`)		
    .then(res => {
      console.log("upVote res:", res)
      if(res.data.nModified === 1){
        upVote(issueId)
      }
          setIssueState(prevState => ({
                ...prevState,
                issueState:  [...prevState.userIssues, res.data]
            }))
      
    })
   
    .catch(err => console.log(err.response.data.errMsg))
 } 

//DOWNVOTE AN ISSUE
function downVote(issueId){
    console.log("issueId for downVote:", issueId)    		
    userAxios.put(`/api/issue/downvote/${issueId}`)		
    .then(res => {
      console.log("downVote res:", res)
          setIssueState(prevState => ({
                ...prevState,
                issueState:  [...prevState.userIssues, res.data]
            }))
    })
   
    .catch(err => console.log(err.response.data.errMsg))
  }

 //DOWNVOTE with limit of 1
 function voterDownVote(issueId){
  console.log("issueId for upVote:", issueId)
  userAxios.put(`/api/issue/voter/vote/${issueId}`)		
    .then(res => {
      if(res.data.nModified === 1){
        downVote(issueId)
      }
      console.log("upVote res:", res)
          setIssueState(prevState => ({
                ...prevState,
                issueState:  [...prevState.userIssues, res.data]
            }))
   
    })
   
    .catch(err => console.log(err.response.data.errMsg))
 } 


 //VOTER VOTE (using _voters)--this uses $addToSet, so will only add if not already there
//  function voterVote(issueId){
//   console.log("issueId for upVote:", issueId)
//   userAxios.put(`/api/issue/voter/vote/${issueId}`)		
//     .then(res => {
//       console.log("upVote res:", res)
//           setIssueState(prevState => ({
//                 ...prevState,
//                 issueState:  [...prevState.userIssues, res.data]
//             }))
//     })
   
//     .catch(err => console.log(err.response.data.errMsg))
//  } 

//UPVOTE A COMMENT
function upVoteComment(commentId){
  console.log("commentId for upVote:", commentId)
  userAxios.put(`/api/comment/upvoteit/${commentId}`)		
    .then(res => {
      console.log("upVote res:", res)
          setIssueState(prevState => ({
                ...prevState,
                issueState:  [...prevState.userIssues, res.data]
            }))
    })
   
    .catch(err => console.log(err.response.data.errMsg))
  }


//UPVOTE a COMMENT with limit of 1 (using _voters)--this uses $addToSet, so will only add if not already there
 function commentUpVote(commentId){
  console.log("commentId for upVote:", commentId)
  userAxios.put(`/api/comment/voter/onlyonce/${commentId}`)		
    .then(res => {
      console.log("upVote res:", res)
      if(res.data.nModified === 1){
        upVoteComment(commentId)
      }
          setIssueState(prevState => ({
                ...prevState,
                issueState:  [...prevState.issues, res.data]
            }))
    })
   
    .catch(err => console.log(err.response.data.errMsg))
 } 


//DOWNVOTE A COMMENT
function downVoteComment(commentId){
    console.log("commentId for downVote:", commentId)    		
    userAxios.put(`/api/comment/downvoteit/${commentId}`)		
    .then(res => {
      console.log("downVote res:", res)
          setIssueState(prevState => ({
                ...prevState,
                issueState:  [...prevState.userIssues, res.data]
            }))
    })
   
    .catch(err => console.log(err.response.data.errMsg))
  }

 //DOWNVOTE COMMENT with limit of 1
 function commentDownVote(commentId){
  console.log("commentId for downVote:", commentId)
  userAxios.put(`/api/comment/voter/onlyonce/${commentId}`)		
    .then(res => {
      if(res.data.nModified === 1){
        downVoteComment(commentId)
      }
      console.log("downVote res:", res)
          setIssueState(prevState => ({
                ...prevState,
                issueState:  [...prevState.issues, res.data]
            }))
    })
   
    .catch(err => console.log(err.response.data.errMsg))
 } 




//CANCEL VOTE (using _voters) ==> However, how back this out if don't know if it was an up or down vote?
//MAYBE -- Need to separate up and down votes in model and then calculate total??

// function removeVote(issueId){
//   console.log("issueId for remove vote:", issueId)
//   userAxios.put(`/api/issue/voter/cancelvote/${issueId}`)		
//     .then(res => {
//       console.log("upVote res:", res)
//           setIssueState(prevState => ({
//                 ...prevState,
//                 issueState:  [...prevState.userIssues, res.data]
//             }))
//     })
   
//     .catch(err => console.log(err.response.data.errMsg))
// }





    return (
        <IssueCommentContext.Provider
            value={{
            ...issueState,
            getUserIssues,
            voterUpVote,
            voterDownVote,
            calcNetVotes,
            addIssue,
            deleteIssue,
            editIssue,
            getComments,
            addComment,
            combinedAddComment,
            deleteComment,
            commentUpVote,
            commentDownVote,
            editComment,
            getIssues
        }}>

        {props.children}


        </IssueCommentContext.Provider>

    )

}