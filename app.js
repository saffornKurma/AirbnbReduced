const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const methodOverride=require("method-override")
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/expressError")
const session=require("express-session");
//for cloud seesion mngo store
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");//THIS IS USED TO CREATE FLASH MESSAGES THAT APPERAR ONCE AND DISAPPEARS//NOTE THIS NEEDS SESSION FIRST!
require("dotenv").config();
//PASSPORT IS USED TO AUTHENTICATE
//THERE ARE NUMEROUS WAYS TO AUTHENTICATE PASSPORT LOCAL USES LOCAL SEESION STORAGE TO STORE DATA
const passport=require("passport");
const LocalPassportStrategy=require("passport-local");
const User=require("./models/User");


dbUrl=process.env.MONGO_ATLAS_DB_URL;
console.log("dbUrl is--"+dbUrl);



const listingsRoute=require("./routes/listingsRoute.js")
const reviewsRoute=require("./routes/reviewRoute.js")
const userRoute=require("./routes/userRoute")

app.set("views",path.join(__dirname,"views"))
app.set("view engine","ejs");

//for boilerplate code that can be seen in every page common things across page
app.engine("ejs",ejsMate)

app.use(express.static(path.join(__dirname,"/public")))
app.use(express.urlencoded({extended:true}))
app.use(methodOverride("_method"));

//THIS IS OPTION FOR MONGO SESSION WHEN DEPLOYING IN CLOUD
const store=MongoStore.create({
    mongoUrl: dbUrl,
    crypto:{
        secret:process.env.SECRET,
    } // See below for details
    ,
    touchAfter:24*3600//dureation of data to be stored in seesion like user details etc
  });
//JUST IF SESSION IS NOT CREATED
  store.on("error",()=>{
    console.log("ERROR in MONGO SEESION STORE",err);
  })

//SESSION OPTIONS IN ORDER TO USE FLASHES
const sessionOptions={
    store:store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{//THIS COOKIE IS EXPIRE DATE FROM BROWSER
        expires:Date.now()+7*24*60*60*1000,//milliseconds after one week
        maxAge:7*24*60*60*1000,
        httpOnly:true,//FOR CROSS SCRIPTING ATTACKS
    }
}

//NOTE!!!!!!!  ALWAYS DEFINE SEESION BEFORE USING PASSPORT BELOW(PASSPORT INIT SHOULD COME BELOW )
//IS THIS IS SET CHECK FOR CONNECT.SID IN BROWSER
//ALSO THIS SESSION IS USED BY PASSPORT FOR LOCAL AUTHENTICATION AS WELL
app.use(session(sessionOptions));
//NOTE!!:ALWAYS USE THIS BEFORE BELOW USE ROUTE<COZ YOU ARE USING THIS FLASHES IN SIDE.
app.use(flash());

//ALL THESE METHODS OF PASSPORT ARE STATIC METHODS
//THIS IS TOO INTIALIZE PASSPORT
app.use(passport.initialize());
//LETS PASSPORT USE THE SESSION DATA
app.use(passport.session());
//THIS BELOW IS LOCAL STRATEGY WHERE WE SEND USER SCHEMA TO AUTHENTICATE
passport.use(new LocalPassportStrategy(User.authenticate()))
//BELOW USE SERILIZATION AND DESERRIALIZATION THE WAY IT STORES LOCAL USER DATA IN SESSION
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



//THIS BELOW IS DEMO TO UNDERSTAND PASSPORT
//UNCOMMENT IT TO UNDERSTAND PASSPORT 
app.get("/demoUser",async (req,res)=>{
    console.log("hitting demoUser");
    const fakeUser=new User({
        email:"shree234@gmail.com",
        username:"sigma-student"
    });
    //REGISTER FUNCTION IS A STATIC FUNTION WHICH ALLOWS TO CHECK DUPLICATE USERNAME TOO
    //APART FROM REGISTER IT INTO THE SESSION
    //User IS YOUR SCHEMA
    //NOTE!!!!! register IS A AWAIT FUNCTION
    let resDummy=await User.register(fakeUser,"JaiHanuman");
    res.send(resDummy);

})



//THIS MDW IS USUALLY USED FOR FLASH MESSAGES
//THIS HAS TO BE ALSO BEFORE ROUTE /LISTINGS
app.use((req,res,next)=>{
    //THIS IS 
    res.locals.success=req.flash("SUCCESS");
    res.locals.error=req.flash("ERROR");
    //THIS RES.LOCALS.SUCCESS "SUCESSS" KEYWORD WRITTEN ALONG WITH LOCALS IS USED IN INDEX
    res.locals.currUser=req.user;
    //HERE WE CREATE LOCALS.USER TO STORE THE USER WE GET FROM REQ
    //WHY BECAUSE REQ.USER IS NOT ACCESSIBLE IN EJS
    //BUT LOCALS ARE AVAILABLE
    next();
})

//USING EXPRESS ROUTE TO KEEP SEPERTE ROUTES
app.use("/listings",listingsRoute)
app.use("/listings/:id/review",reviewsRoute)
app.use("/",userRoute)




//MONGO DB CONNECTION
const main=async ()=>await mongoose.connect(dbUrl);
main().then(()=>{
    console.log(`DB connection success`);
}).catch(err=>{
    console.log(err);
})

const port=5050;
//FOR ALL UNWANTED API ROUTES COMMON ENDPOINT
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found!"))
})
//MIDDLEWARE FOR ALL ERRORS THREW
app.use((err,req,res,next)=>{
    let {statusCode=500,message="Something went wrong really bad!"}=err;
    res.status(statusCode).render("error.ejs",{message});
})
//SERVER
app.listen(port,()=>{
    console.log(`Server started and listening at ${port}`);
})
