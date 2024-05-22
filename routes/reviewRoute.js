const express=require("express");
const wrapAsync=require("../utils/wrapAsync")
const ExpressError=require("../utils/expressError")


const ListingsCollection=require("../models/Listing");
const ReviewCollection=require("../models/Reviews")

//MERGE PARAMS IS REQUIRED TO ACCESS THE PARENT ID HERE OF LISTINGS IN ROUTER OF CHID
const router=express.Router({mergeParams:true});
const { isLoggedIn ,isOwner,validateReviews,isReviewAuthor} = require("../middleware.js");


//reviews
//route
router.post("/",isLoggedIn,validateReviews,wrapAsync(async(req,res)=>{
    let listing=await ListingsCollection.findById(req.params.id);
    let review=new ReviewCollection(req.body.review);
    review.author=req.user._id;
    console.log("IN REVIEW "+review.author);
    console.log("2"+req.body);
    console.log("3"+req.params.id);
    console.log("4"+listing);
    listing.reviews.push(review);
    let resp=await listing.save();
    await review.save();
    console.log("1"+resp);
     //console.log(listingToEdit);
     //USING FLASHES HERE TO RPRESENT NEW LISTING ADDED,HOW DO YOU CRETE IT IS AS BELOW
    //ITS A KEY VALUE PAIR AND YOU USE THIS KEY IN MDW RES.LOCALS SO THT WHEN RENDERED IT AUTOMATICALLY SENT
    req.flash("SUCCESS","REVIEW IS CREATED!")
    //SO WE ARE REDERING /LISTINGS THAT IS INDEX.EJS VIEWS WHERE YOU NEED TO ACCESS THE SUCCESS!
    res.redirect(`/listings/${req.params.id}`);
    }))
    
    //delete review and clear listing 
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(async(req,res)=>{
    let {id,reviewId} =req.params;
    console.log("I AM IN REVIEW ROUTE"+req.params);
    let res1=await ReviewCollection.findByIdAndDelete(reviewId);
    //FIRST YOU NEED TO REMOVE IT FROM LISTING AS WELL SO PULL[delete] FROM THE LISTING.REVIEWS
    let res2=await ListingsCollection.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});

     //console.log(listingToEdit);
     //USING FLASHES HERE TO RPRESENT NEW LISTING ADDED,HOW DO YOU CRETE IT IS AS BELOW
    //ITS A KEY VALUE PAIR AND YOU USE THIS KEY IN MDW RES.LOCALS SO THT WHEN RENDERED IT AUTOMATICALLY SENT
    req.flash("SUCCESS","REVIEW IS EDITTED!")
    //SO WE ARE REDERING /LISTINGS THAT IS INDEX.EJS VIEWS WHERE YOU NEED TO ACCESS THE SUCCESS!


    res.redirect(`/listings/${id}`);
    }))
    

module.exports=router;