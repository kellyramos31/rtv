const express = require("express")
const app = express()
require("dotenv").config()
const path = require("path")
const morgan = require("morgan")
const mongoose = require("mongoose")
const expressJwt = require("express-jwt")

app.use(express.json())
app.use(morgan("dev"))

// mongoose.connect(
//     "mongodb://localhost:27017/user-authentication2",
//     {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//         useCreateIndex: true,
//         useFindAndModify: false
//     },
//     () => console.log("Connected to the DB")
// )

mongoose.connect(
    process.env.MONGODB_URI,
    {
        // useNewUrlParser: true
    },
    () => console.log("Connected to the DB")
)

// mongoose.connect(
//     "mongodb://localhost:27017/test",
//     () => console.log("Connected to database.")
// )

app.use(express.static(path.join(_dirname, "client", "build")))
app.use("/auth", require("./routes/authRouter.js"))
app.use("/api", expressJwt({secret: process.env.SECRET || "abracadabra sizzle oops lalala", algorithms: ['HS256']}))  //creates req.user -- ALSO:  algorithms: for express-jwt v6.0.0 & higher: adding an algorithm parameter is now required in addition to the secret.
app.use("/api/issue", require("./routes/issueRouter.js"))
app.use("/api/comment", require("./routes/commentRouter.js"))


app.use((err, req, res, next) => {
    console.log(err)
    if(err.name === "UnauthorizedError"){
        res.status(err.status)
    }
    return res.send({ errMsg: err.message })
})

app.get("*", (req, res)=> {res.sendFile(path.join(_dirname, "client", "build", "index.html"))})

app.listen(process.env.PORT || 9000, () => {
    console.log("Server is running on local port 9000")
})