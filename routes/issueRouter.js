const express = require("express");
const { isValidObjectId } = require("mongoose");
const issueRouter = express.Router();
const Issue = require("../models/issue.js");
const Comment = require("../models/comment.js");



//NOTE:  ISSUES SHOULD BE ORDERED BY UPVOTES/DOWNVOTES -- NEED TO ADD THIS IN (maybe $sort method)
//NOTE:  ****USERS SHOULD ONLY BE ABLE TO UPVOTE/DOWNVOTE AN ISSUE ONCE****NEED TO ADD IN

//GET ALL ISSUES (Sorted in descending voteCount order) -- use for Public Page
// issueRouter.get("/", (req, res, next) => {
//     //  Issue.find({}).populate("_comments.commentText")
//      Issue.aggregate([
//       { $sort: { voteCount: -1 } }
//       ],
//        //code below gets at username, but also creates separate array
       
//         // {$unwind: "$commentText"}
//          (err, sortedUserIssues)=> {
//             if (err){
//             res.status(500)
//             return next(err)
//         }
//         return res.status(200).send(sortedUserIssues)
//     })
// });


//GET ALL ISSUES ALTERNATIVE including populate _comments
issueRouter.get("/", (req, res, next) => {
Issue.find({}) 
    .populate("_comments")
    .sort({ upVotes: -1 })
    .exec((err, issues)=> {

        if (err) {
            res.status(500);
            return next(err);
        }
        return res.status(201).send(issues);
})
})


//TRYING TO SORT _COMMENTS ARRAY FOR SPECIFIC ISSUE

issueRouter.put("/sort/:issueId", (req, res, next) => {
    issueId = req.params.issueId
    Issue.findOneAndUpdate(

        {$unwind: "$_comments"},
        {$match: {_id: 1}},
        {$sort: {upVotesComments: -1}}
    ),
    (err, issues)=> {
            if (err) {
            res.status(500);
            return next(err);
        }
        return res.status(201).send(issues);
}})



//GET ISSUES FOR INDIVIDUAL USER -- NOTE:  this sorts the issues, but doesn't give user specific issues now.

issueRouter.get("/user", (req, res, next)=>{
    // const filter = { _user: req.body._user} //pretty sure problem = this line here
    //const ObjectId = require('mongoose').Types.ObjectId
    const ObjectId = require('mongodb').ObjectId            //problem with matching the ID(this solution is from Stack Overflow)   
    Issue.aggregate([
       { $match: { _user: new ObjectId(req.user._id) } },  //problem with matching the ID(this solution is from Stack Overflow)
       { $sort: { upVotes: -1 } },
       { $lookup: 
        { from: "comments",
          localField: "_comments",
          foreignField: "_id",
          as: "userComments"
        }}
    ],
         (err, sortedUserIssues)=> {
            if (err){
            res.status(500)
            return next(err)
        }
        return res.status(200).send(sortedUserIssues)
    })
})

//GET ALL ISSUES FOR INDIVIDUAL USER == THIS ONE WORKS, BUT DOES NOT SORT
// issueRouter.get("/user", (req, res, next)=>{
//     Issue.find({_user: req.user._id}, (err, issues)=>{
//         if(err) {
//             res.status(500)
//             return next(err)
//         }
//         console.log("issues", issues)
//         return res.status(200).send(issues)
//     }).populate({
//         path: "_comments"
//     })
// })
        
//ADD NEW ISSUE
issueRouter.post("/", (req, res, next) => {
    req.body._user = req.user._id
    const issue = new Issue(req.body);
    issue.save(function (err, newIssue) {
        if (err) {
            res.status(500);
            return next(err);
        }
        return res.status(201).send(newIssue);
    })
})


//GET ONE ISSUE
issueRouter.get("/:issueId", (req, res, next) => {
    Issue.findById(req.params.issueId, (err, issue) => {
        if (err) {
            res.status(500);
            return next(err);
        } else if (!issue) {
            res.status(404)
            return next(new Error("No issue found."));
        }
        return res.send(issue);
    })
})


//EDIT ISSUE
issueRouter.put("/:issueId", (req, res, next) => {
    Issue.findByIdAndUpdate(
        {_id: req.params.issueId, _user: req.user._id  },
        req.body,
        { new: true },
        (err, issue) => {
            if (err) {
                console.log("Error");
                res.status(500);
                return next(err);
            }
            return res.send(issue);
        })
})



//DELETE ISSUE ---AND ITS ASSOCIATED COMMENTS
issueRouter.delete("/:issueId", (req, res, next)=> {

    Issue.findByIdAndDelete(
    { _id: req.params.issueId, _user: req.user._id },
    (err, deletedIssue) => {
        if (err) {
            res.status(500);
            return next(err);
        }

    Comment.deleteMany({_issue: req.params.issueId}, (err, comments)=>{
        if(err) {
            res.status(500)
            return next(err)
        }
    })
        return res.status(200).send(`Successfully deleted: ${deletedIssue.title}`);
    })
})



//DELETE specified comment from _comment array
issueRouter.put("/deleteCommentFromIssue/:issueId", (req, res, next)=> {
        const commentId = req.body._comment
        // const ObjectId = require('mongodb').ObjectId 
        Issue.findByIdAndUpdate(
            {_id: req.params.issueId, _user: req.user._id},
            { $pull: { "_comments": commentId}},
        (err, updatedIssue) => {
            if (err) {
                console.log("Error");
                res.status(500);
                return next(err);
            }
            return res.send(updatedIssue);
            //note:  appears to pull the commentId from the array in issues, but "updatedIssue res still shows comment id"  
        })
    })

   



//NOTE:  ****USER SHOULD ONLY BE ABLE TO UPVOTE/DOWNVOTE AN ISSUE ONCE****NEED TO FIGURE THIS OUT

//UPVOTE AN ISSUE--INCREMENT -- this one works to increment vote count --but can vote as many times as want to...
issueRouter.put("/upvote/:issueId", (req, res, next)=> {			
  Issue.findByIdAndUpdate(			
  {_id: req.params.issueId, _user: req.user._id },	
  { $inc: {upVotes: 1, totalVotersVotedCount: 1} },			
  {new: true},			
  (err, updatedIssue)=> {			
      if(err){			
          res.status(500)			
          return next(err)			
      }			
      return res.status(201).send(updatedIssue)			
   }			
  )			
})

//VOTE ON AN ISSUE (adds to _voters array but only ONCE) -- NOTE:  seems to ??MAYBE?? work NOW -- BUT...how implement with rest on front-end??
issueRouter.put("/voter/vote/:issueId", (req, res, next)=> {		

Issue.updateOne(
    {_id: req.params.issueId}, 
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
issueRouter.put("/downvote/:issueId", (req, res, next)=> {			
  Issue.findByIdAndUpdate(			
  {_id: req.params.issueId, _user: req.user._id },		//maybe don't need _user: req.user._id here??
  { $inc: {downVotes: 1, totalVotersVotedCount: 1} },			
  {new: true},			
  (err, updatedIssue)=> {			
      if(err){			
          res.status(500)			
          return next(err)			
      }			
      return res.status(201).send(updatedIssue)		
   }			
  )			
})	




//INCREMENT TOTAL # OF COMMENTS ON ISSUE
issueRouter.put("/increment/:issueId", (req, res, next) => {
    req.body._user = req.user._id
 
    const issueId = req.params.issueId
      
        Issue.findByIdAndUpdate(
            {_id: issueId, _user: req.user._id},
            { $inc: { numberCommentsOnIssue: 1}},
            { new: true},
        (err, updatedIssue) => {
            if (err) {
                console.log("Error");
                res.status(500);
                return next(err);
            }
            return res.send(updatedIssue)
        })
})

//DECREMENT TOTAL # OF COMMENTS ON ISSUE
issueRouter.put("/decrement/:issueId", (req, res, next) => {
    req.body._user = req.user._id
 
    const issueId = req.params.issueId
      
        Issue.findByIdAndUpdate(
            {_id: issueId, _user: req.user._id},
            { $inc: { numberCommentsOnIssue: -1}},
            { new: true},
        (err, updatedIssue) => {
            if (err) {
                console.log("Error");
                res.status(500);
                return next(err);
            }
            return res.send(updatedIssue)
        })
})

//TOTAL # OF COMMENTS FOR SPECIFIC ISSUE
issueRouter.get("/countComments/:issueId", (req, res, next)=> {
   Issue.aggregate([
        // {$match: {_id: req.params.issueId}},
        {"$project": {
            "count": { "$size": "_comments"}
        }}
    ]), 
        (err, commentCount)=> {
            if (err){
            res.status(500)
            return next(err)
        }
        return res.status(200).send(commentCount)
    }

})

		

module.exports = issueRouter;