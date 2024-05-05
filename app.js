const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const methodOverride=require("method-override")
const ejsMate=require("ejs-mate");

app.set("views",path.join(__dirname,"views"))
app.set("view engine","ejs");


//for boilerplate code that can be seen in every page common things across page
app.engine("ejs",ejsMate)

app.use(express.static(path.join(__dirname,"/public")))
app.use(express.urlencoded({extended:true}))
app.use(methodOverride("_method"));

const main=async ()=>await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');


main().then(()=>{
    console.log(`DB connection success`);
}).catch(err=>{
    console.log(err);
})

const ListingsCollection=require("./models/Listing");
const { log } = require("console");


const port=5050;


//create new listing
app.get("/listings/new",async (req,res)=>{
    console.log("hitting new");
    res.render("listings/new.ejs");
})

//one listing api
app.get("/listings/:id",async (req,res)=>{

    let {id}=req.params;
    
    const onelisting = await ListingsCollection.findById(id);

    res.render("listings/showOne.ejs",{onelisting});
   
})


//all listing api
app.get("/listings",async (req,res)=>{
    
    const allListings = await ListingsCollection.find({});

    res.render("listings/index.ejs",{allListings});
})


//edit listing
app.get("/listings/:id/edit",async (req,res)=>{

    let {id}=req.params;
    let listingToEdit=await ListingsCollection.findById(id);
    //console.log(listingToEdit);
    res.render("listings/edit.ejs",{listingToEdit});
})


//POST new
app.post("/listings",async (req,res)=>{

    let {title,description,price,location,country}=req.body;

    let response=await ListingsCollection.create({title,description,price,location,country})

    res.redirect("/listings");
})

//PUT edit the listing
//POST new
app.put("/listings/:id/edit",async (req,res)=>{
    let {id}=req.params;

    let {title,description,price,location,country}=req.body;

    let response=await ListingsCollection.findByIdAndUpdate(id,{title,description,price,location,country})
    
    res.redirect("/listings");
})

//Delete a  post
app.delete("/listings/:id/delete",async (req,res)=>{
    let {id}=req.params;

    //let {title,description,price,location,country}=req.body;

    let response=await ListingsCollection.findByIdAndDelete(id)
    
    res.redirect("/listings");
})

app.listen(port,()=>{
    console.log(`Server started and listening at ${port}`);
})
