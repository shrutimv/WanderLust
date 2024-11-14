const express = require("express");
const app = express();
const ExpressError = require("./ExpressError");

const checkToken = ((req,res,next) =>{
    let {token} = req.query;
    console.log(token);
    if(token==="giveaccess"){
       next(); 
    }else{
        throw new ExpressError(401,"ACCESS DENIED!");
    }    
})

app.get("/api",checkToken,(req,res)=>{
    res.send("data");
})

app.get("/admin",(req,res)=>{
    throw new ExpressError(403,"Authentication error");
})

app.use((err,req,res,next)=>{
    let {status = 500, message = "Internal server Error"} = err;
    res.status(status).send(message);

})


app.listen(8080,()=>{
    console.log("server started");
})