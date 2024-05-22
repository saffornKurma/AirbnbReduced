const express = require("express");
const wrapAsync = require("../utils/wrapAsync")
const ExpressError = require("../utils/expressError")
const router = express.Router();
//JOI Validation
const ListingJoiSchema = require("../schema.js")
const ReviewJoiSchema = require("../schema.js")
//THIS IS THE MIDDLEWARE WHICH USES REQ.ISAUTHENTICATE TO FROM PASSPORT LIB TO CHECK A USER IS LOGGED IN 
const { isLoggedIn ,isOwner,validateListings,} = require("../middleware.js");




const ListingsCollection = require("../models/Listing");
const ReviewCollection = require("../models/Reviews")



//MDWs

//create new listing
//isLoggedIn check starting comment for this
router.get("/new", isLoggedIn, async (req, res) => {

    res.render("listings/new.ejs");
})

//one listing api
router.get("/:id", wrapAsync(async (req, res) => {

    let { id } = req.params;
//WE ARE NESTING POPULATE WITH PATH:REVIEWS PATH LATER POPULATE AUTHOR
//THE BELOW SAYS FOR ALL REVIEWS POPULATE AUTHOR TOO
//OBSERVE ITS NESTED POPULATE
    const onelisting = await ListingsCollection.findById(id).populate({path:"reviews",populate:{path:"author"},}).populate("owner");

    if (!onelisting) {
        req.flash("ERROR", "LISTING DOESNT EXIST/ALREADY DELETED! ");
        res.redirect("/listings");
        return;
    }

    res.render("listings/showOne.ejs", { onelisting });

})

)
//all listing api
router.get("/", wrapAsync(async (req, res) => {
    console.log("I AM LISTING ALL");
    const allListings = await ListingsCollection.find({});

    res.render("listings/index.ejs", { allListings });
})
)

//edit listing
router.get("/:id/edit",isOwner, isLoggedIn, wrapAsync(async (req, res) => {

    let { id } = req.params;
    let listingToEdit = await ListingsCollection.findById(id);
    if (!listingToEdit) {
        req.flash("ERROR", "LISTING DOESNT EXIST/ALREADY DELETED! ");
        res.redirect("/listings");
        return;
    }

    //USING FLASHES HERE TO RPRESENT NEW LISTING ADDED,HOW DO YOU CRETE IT IS AS BELOW
    //ITS A KEY VALUE PAIR AND YOU USE THIS KEY IN MDW RES.LOCALS SO THT WHEN RENDERED IT AUTOMATICALLY SENT

    req.flash("SUCCESS", "LISTING IS EDITTED!");
    //SO WE ARE REDERING /LISTINGS THAT IS INDEX.EJS VIEWS WHERE YOU NEED TO ACCESS THE SUCCESS!
    res.render("listings/edit.ejs", { listingToEdit });
})
)

//POST new
router.post("/", isLoggedIn, wrapAsync(async (req, res) => {


    let { title, description, price, location, country } = req.body;
    const owner=req.user._id;
    let response = await ListingsCollection.create({ title, description, price, location, country ,owner})
    //let response=await ListingsCollection.create()

    //USING FLASHES HERE TO RPRESENT NEW LISTING ADDED,HOW DO YOU CRETE IT IS AS BELOW
    //ITS A KEY VALUE PAIR AND YOU USE THIS KEY IN MDW RES.LOCALS SO THT WHEN RENDERED IT AUTOMATICALLY SENT
    req.flash("SUCCESS", "NEW LISTING IS ADDED!")
    //SO WE ARE REDERING /LISTINGS THAT IS INDEX.EJS VIEWS WHERE YOU NEED TO ACCESS THE SUCCESS!
    res.redirect("/listings");
})
)

//PUT edit the listing
//POST new
router.put("/:id/edit",isOwner, isLoggedIn, wrapAsync(async (req, res) => {
    let { id } = req.params;

    let { title, description, price, location, country } = req.body;

    let response = await ListingsCollection.findByIdAndUpdate(id, { title, description, price, location, country })

    res.redirect("/listings");
})
)
//Delete a  post
router.delete("/:id/delete",isOwner, isLoggedIn, wrapAsync(async (req, res) => {
    let { id } = req.params;
    //let {title,description,price,location,country}=req.body;
    let response = await ListingsCollection.findByIdAndDelete(id)
    //USING FLASHES HERE TO RPRESENT NEW LISTING ADDED,HOW DO YOU CRETE IT IS AS BELOW
    //ITS A KEY VALUE PAIR AND YOU USE THIS KEY IN MDW RES.LOCALS SO THT WHEN RENDERED IT AUTOMATICALLY SENT
    req.flash("SUCCESS", "LISTING IS DELETED!")
    //SO WE ARE REDERING /LISTINGS THAT IS INDEX.EJS VIEWS WHERE YOU NEED TO ACCESS THE SUCCESS!
    res.redirect("/listings");
})
)

module.exports = router;
