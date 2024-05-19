const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const methodOverride=require("method-override")
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/expressError")
const session=require("express-session");
const flash=require("connect-flash");//THIS IS USED TO CREATE FLASH MESSAGES THAT APPERAR ONCE AND DISAPPEARS//NOTE THIS NEEDS SESSION FIRST!



const listingsRoute=require("./routes/listingsRoute.js")
const reviewsRoute=require("./routes/reviewRoute.js")

app.set("views",path.join(__dirname,"views"))
app.set("view engine","ejs");

//for boilerplate code that can be seen in every page common things across page
app.engine("ejs",ejsMate)

app.use(express.static(path.join(__dirname,"/public")))
app.use(express.urlencoded({extended:true}))
app.use(methodOverride("_method"));

//SESSION OPTIONS IN ORDER TO USE FLASHES
const sessionOptions={
    secret:"mysecretcode",
    resave:false,
    saveUninitialized:true,
    cookie:{//THIS COOKIE IS EXPIRE DATE FROM BROWSER
        expires:Date.now()+7*24*60*60*1000,//milliseconds after one week
        maxAge:7*24*60*60*1000,
        httpOnly:true,//FOR CROSS SCRIPTING ATTACKS
    }
}

//IS THIS IS SET CHECK FOR CONNECT.SID IN BROWSER
app.use(session(sessionOptions));
//NOTE!!:ALWAYS USE THIS BEFORE BELOW USE ROUTE<COZ YOU ARE USING THIS FLASHES IN SIDE.
app.use(flash());


//THIS MDW IS USUALLY USED FOR FLASH MESSAGES
//THIS HAS TO BE ALSO BEFORE ROUTE /LISTINGS
app.use((req,res,next)=>{
    //THIS IS 
    res.locals.success=req.flash("SUCCESS");
    res.locals.error=req.flash("ERROR");
    //THIS RES.LOCALS.SUCCESS "SUCESSS" KEYWORD WRITTEN ALONG WITH LOCALS IS USED IN INDEX
    next();
})

//USING EXPRESS ROUTE TO KEEP SEPERTE ROUTES
app.use("/listings",listingsRoute)
app.use("/listings/:id/review",reviewsRoute)




//MONGO DB CONNECTION
const main=async ()=>await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
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
