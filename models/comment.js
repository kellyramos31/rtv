const mongoose = require("mongoose");
const Issue = require("../models/issue.js");
const Schema = mongoose.Schema;


const commentSchema = new Schema({
    commentText: {
        type: String,
        required: true
    },
    upVotesComments: {
        type: Number,
        default: 0
    },
    downVotesComments: {
        type: Number,
        default: 0
    },
    totalVotersOnCommentCount: {
        type: Number
    },
    _voters: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    _user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    _issue: {
        type: Schema.Types.ObjectId,
        ref: "Issue",
        required: true
    }
})

const autoPopulateUser  = function(next) {
    this.populate({
        path: "_user",
        select: "username _id"
    })
    next()
    }

commentSchema.pre("find", autoPopulateUser)


// commentSchema.post("deleteOne", function(next){
//     Issue.deleteOne( { _comments: this._id}, next)
// } )  

module.exports = mongoose.model("Comment", commentSchema)