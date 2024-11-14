if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const listingRouter = require("./routes/listing")
const reviewRouter = require("./routes/review");
const userRouter = require("./routes/user");
const session = require("express-session");
const mongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStratergy = require("passport-local");
const User = require("./models/user");
const MongoStore = require("connect-mongo");


const app = express();
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));


app.use(methodOverride('_method'));
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"/public")));

app.engine("ejs",ejsMate);

// const MONGO_URL = "mongodb://127.0.0.1:27017/Wanderlust"
const dbUrl = process.env.ATLASDB_URL;

main()
.then(()=>{
    console.log("connected to DB");
})
.catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect(dbUrl);
}

const store = MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET
    },
    touchAfter:24*3600
})

store.on("error",()=>{
    console.log("error in Mongo Session Store", err);
})

const sessionOptions = {
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() + 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly:true
    }
}

// app.get("/",(req,res)=>{
//     res.send("Hi, I'm root page");
// })

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use( new LocalStratergy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})



// LISTING

app.use("/listings",listingRouter)

// REVIEW

app.use("/listings/:id/reviews",reviewRouter);

// SignUp

app.use("/", userRouter);


app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found"));
})

app.use((err,req,res,next)=>{
    let {status = 500, message="something went wrong"} = err;
    // res.status(status).send(message);
    res.status(status).render("error.ejs",{err});
    
})

app.listen(8080,()=>{
    console.log("listening to port 8080");
})






// app.get("/testListing",async (req,res)=>{
//     let sampleListing = new Listing ({
//         title: "My New Villa",
//         description: "By the beach",                  
//         price:1200,
//         location:"Goa",
//         counrty:"India"
//     });

//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successful")
// })

