const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const methodOverride=require("method-override")
const ejsMate=require("ejs-mate");

const wrapAsync=require("./utils/wrapAsync")
const ExpressError=require("./utils/expressError")
//JOI Validation
const ListingJoiSchema=require("./schema.js")
const ReviewJoiSchema=require("./schema.js")

app.set("views",path.join(__dirname,"views"))
app.set("view engine","ejs");


//for boilerplate code that can be seen in every page common things across page
app.engine("ejs",ejsMate)

app.use(express.static(path.join(__dirname,"/public")))
app.use(express.urlencoded({extended:true}))
app.use(methodOverride("_method"));

const main=async ()=>await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');


const validateListings=(req,res,next)=>{

    
    const {error}=ListingJoiSchema.validate(req.body);
    
    if(error){
        throw new ExpressError(400,error)
    }
    else{
        next();
    }
}

const validateReviews=(req,res,next)=>{
    const {error}=ReviewJoiSchema.validate(req.body);
    if(error)
    {
        throw new ExpressError(400,error);
    }

    next();
}

main().then(()=>{
    console.log(`DB connection success`);
}).catch(err=>{
    console.log(err);
})

const ListingsCollection=require("./models/Listing");
const ReviewCollection=require("./models/Reviews")
const { log } = require("console");


const port=5050;


//create new listing
app.get("/listings/new",async (req,res)=>{
    
    res.render("listings/new.ejs");
})

//one listing api
app.get("/listings/:id",wrapAsync(async (req,res)=>{

    let {id}=req.params;
    
    const onelisting = await ListingsCollection.findById(id).populate("reviews");

    res.render("listings/showOne.ejs",{onelisting});
   
})

)
//all listing api
app.get("/listings",wrapAsync(async (req,res)=>{
    
    const allListings = await ListingsCollection.find({});

    res.render("listings/index.ejs",{allListings});
})
)

//edit listing
app.get("/listings/:id/edit",wrapAsync(async (req,res)=>{

    let {id}=req.params;
    let listingToEdit=await ListingsCollection.findById(id);
    //console.log(listingToEdit);
    res.render("listings/edit.ejs",{listingToEdit});
})
)

//POST new
app.post("/listings",validateListings,wrapAsync(async (req,res)=>{

    console.log("i cam inside listing post");
    let {title,description,price,location,country}=req.body;

    let response=await ListingsCollection.create({title,description,price,location,country})
    //let response=await ListingsCollection.create()

    res.redirect("/listings");
})
)

//PUT edit the listing
//POST new
app.put("/listings/:id/edit",wrapAsync(async (req,res)=>{
    let {id}=req.params;

    let {title,description,price,location,country}=req.body;

    let response=await ListingsCollection.findByIdAndUpdate(id,{title,description,price,location,country})
    
    res.redirect("/listings");
})
)
//Delete a  post
app.delete("/listings/:id/delete",wrapAsync(async (req,res)=>{
    let {id}=req.params;

    //let {title,description,price,location,country}=req.body;

    let response=await ListingsCollection.findByIdAndDelete(id)
    
    res.redirect("/listings");
})
)

//reviews
//route
app.post("/listings/:id/review",validateReviews,wrapAsync(async(req,res)=>{
let listing=await ListingsCollection.findById(req.params.id);
let review=new ReviewCollection(req.body.review);
console.log(req.body);
console.log(req.params.id);
console.log(listing);
listing.reviews.push(review);
let resp=await listing.save();
await review.save();
console.log(resp);
res.redirect(`/listings/${req.params.id}`);
}))

//delete review and clear listing 
app.delete("/listings/:id/review/:reviewId",wrapAsync(async(req,res)=>{
    let {id,reviewId} =req.params;
    console.log(req.params);

    let res1=await ReviewCollection.findByIdAndDelete(reviewId);
    let res2=await ListingsCollection.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});

    console.log(res1);
    console.log(res2);




    res.redirect(`/listings/${id}`);
    }))


app.all("*",(req,res,next)=>{

    console.log("i # inside listing post");

    next(new ExpressError(404,"Page Not Found!"))
})

app.use((err,req,res,next)=>{
   
    let {statusCode=500,message="Something went wrong really bad!"}=err;

    res.status(statusCode).render("error.ejs",{message});

})


app.listen(port,()=>{
    console.log(`Server started and listening at ${port}`);
})
