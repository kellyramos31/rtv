const express = require("express");
const { isValidObjectId } = require("mongoose");
const commentRouter = express.Router();
const Comment = require("../models/comment.js");
const Issue = require("../models/issue.js");

//GET ALL COMMENTS
commentRouter.get("/", (req, res, next) => {
Comment.find((err, comments) => {
        if (err) {
            res.status(500);
            return next(err);
        }
        return res.send(comments);
    });
});

//GET COMMENTS FOR INDIVIDUAL USER
commentRouter.get("/user", (req, res, next)=>{
    Comment.find({_user: req.user._id}, (err, comments)=>{
        if(err) {
            res.status(500)
            return next(err)
        }
        console.log("comments", comments)
        return res.status(200).send(comments)
    })
})


//DELETE ALL COMMENTS FOR A SPECIFIC ISSUE
commentRouter.delete("/issue/:issueId", (req, res, next)=>{
    Comment.deleteMany({_issue: req.params.issueId}, (err, comments)=>{
        if(err) {
            res.status(500)
            return next(err)
        }
        console.log("all comments for specified post id", comments)
        return res.status(200).send(comments)
    })
})



//NOTE:  THIS ONE WORKS TO ADD COMMENT, BUT....NOT PUSHING TO ARRAY
// commentRouter.post("/", (req, res, next) => {
//     req.body._user = req.user._id
//     const comment = new Comment(req.body);

//     comment.save(function(err, newComment) {
//         if (err) {
//             res.status(500)
//             return next(err)
//         }
                 
//         return res.status(201).send(newComment);
//     })
// })

//TRYING TO MODIFY COMMENT ADD/POST TO WORK ON FRONTEND:
// commentRouter.post("/", (req, res, next) => {
//     const _user = req.user._id
//     const { commentText, _issue } = req.body 
//      const comment = new Comment({
//        commentText,
//        _issue,
//        _user
//      })
 

//     comment.save(function(err, newComment) {
//         if (err) {
//             res.status(500)
//             return next(err)
//         }
                 
//         return res.status(201).send(newComment);
//     })
// })

   
//TRY TO JUST PUSH COMMENT ID TO ISSUES ARRAY...THIS NOW PUSHES COMMENT ID TO ISSUES ARRAY
// commentRouter.put("/pusharray/:commentId", (req, res, next) => {
//        const issueId = req.body._issue
//         Issue.findByIdAndUpdate(
//             {_id: issueId, _user: req.user._id},
//             { $push: { "_comments": req.params.commentId }},
//             { new: true},
//         (err, commentId) => {
//             if (err) {
//                 console.log("Error");
//                 res.status(500);
//                 return next(err);
//             }
//             return res.send(commentId);
//         })
//     })


//COMBINES THE TWO ROUTES DIRECTLY ABOVE (THE ADD COMMENT & UPDATE COMMENTS ARRAY WITHIN ISSUES REQUESTS)***
//NOTE:  this is returning the issue with the comment, BUT -- NOT the comment
commentRouter.post("/", (req, res, next) => {
    req.body._user = req.user._id
    // req.body.username = req.user._id.username
      
    const comment = new Comment(req.body);

    comment.save(function(err, newComment) {
          if (err) {
            res.status(500)
            return next(err)
        }
   
        
    const issueId = req.body._issue
      
        Issue.findByIdAndUpdate(
            {_id: issueId, _user: req.user._id},
            { $push: { "_comments": newComment._id}},
            { new: true},
        (err, updatedIssue) => {
            if (err) {
                console.log("Error");
                res.status(500);
                return next(err);
            }
            return res.send(newComment);
        })
    })
})




//DELETE COMMENT (but leaves the REF in the associated issue)
commentRouter.delete("/:commentId", (req, res, next)=> {
   
Comment.findByIdAndDelete(
    { _id: req.params.commentId, _user: req.user._id },
    (err, deletedComment) => {
        if (err) {
            res.status(500);
            return next(err) 
        }
  return res.send(deletedComment);

  })
})


//DELETE COMMENT ref id from _comments array in issue model
commentRouter.put("/deleteCommentFromIssue/:commentId", (req, res, next)=> {
  
        req.body._user = req.user._id
        const issueId = req.body._issue

        Issue.findByIdAndUpdate(
            {_id: issueId, _user: req.user._id},
            { $pull: { "_comments": req.params.commentId}},
        (err, updatedIssue) => {
            if (err) {
                console.log("Error");
                res.status(500);
                return next(err);
            }
            return res.send(updatedIssue);
        })
    })


//EDIT COMMENT
commentRouter.put("/:commentId", (req, res, next) => {
    Comment.findByIdAndUpdate(
        {_id: req.params.commentId, _user: req.user._id},
        req.body,
        { new: true },
        (err, comment) => {
            if (err) {
                console.log("Error");
                res.status(500);
                return next(err);
            }
            return res.send(comment);
        })
})


//UPVOTE A COMMENT-INCREMENT -- this one works to increment vote count --but can vote as many times as want to...
commentRouter.put("/upvoteit/:commentId", (req, res, next)=> {			
  Comment.findByIdAndUpdate(			
  {_id: req.params.commentId, _user: req.user._id },	
  { $inc: {upVotesComments: 1, totalVotersOnCommentCount: 1} }, 		
  {new: true},
			
  (err, updatedComment)=> {			
      if(err){			
          res.status(500)			
          return next(err)			
      }		
      
    
      return res.status(201).send(updatedComment)			
   }			
  )			
})


//VOTE ON AN ISSUE (adds to _voters array but only ONCE) -- NOTE:  seems to ??MAYBE?? work NOW -- BUT...how implement with rest on front-end??
commentRouter.put("/voter/onlyonce/:commentId", (req, res, next)=> {		

Comment.updateOne(
    {_id: req.params.commentId}, 
    { $addToSet: { _voters: req.user._id } },


(err, issues)=> {
    if (err) {
            res.status(500);
            return next(err);
        }
        return res.status(201).send(issues);
})
})
		


//DOWNVOTE AN ISSUE--DECREMENT this works to decrement vote count === but can downVote as many times as want
commentRouter.put("/downvoteit/:commentId", (req, res, next)=> {	

Comment.findByIdAndUpdate(			
  {_id: req.params.commentId, _user: req.user._id },		//maybe don't need _user: req.user._id here??
  { $inc: {downVotesComments: 1, totalVotersOnCommentCount: 1} },				
  {new: true},
 	
  (err, updatedComment)=> {			
      if(err){			
          res.status(500)			
          return next(err)			
      }
      
 
    return res.status(201).send(updatedComment)		
   }

        

  )			
})	



module.exports = commentRouter;