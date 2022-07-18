const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Comment = require("../models/comment.js");



const issueSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    //maybe voteCount should be array of userIds instead of just #?
    //need a net votes count??
    upVotes: {
        type: Number,
        default: 0
    },
    downVotes: {
        type: Number,
        default: 0
    },
   
    totalVotersVotedCount: {
        type: Number,
        default: 0
    },
    numberCommentsOnIssue: {
        type: Number,
        default: 0
    },
    _voters: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    _user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    _comments: [{ type: Schema.Types.ObjectId, ref: "Comment"}]
})


const autoPopulateUser  = function(next) {
    this.populate({
        path: "_user",
        select: "username _id"
    })
    next()
    }

issueSchema.pre("find", autoPopulateUser)

// You can add your own 'remove' Mongoose middleware on the Person schema to 
// remove that person from all other documents that reference it. 
// In your middleware function, this is the Person document that's being removed.

// Person.pre('remove', function(next) {
//     // Remove all the assignment docs that reference the removed person.
//     this.model('Assignment').remove({ person: this._id }, next);
// });

//Middleware to get rid of _issue refs in Comment model

// issueSchema.post("deleteMany", {document: true, query: false}, async function(next){
//     const issue = this
//     await Comment.deleteMany( {$pullAll: issue._id}, next)
// } )  

module.exports = mongoose.model("Issue", issueSchema)