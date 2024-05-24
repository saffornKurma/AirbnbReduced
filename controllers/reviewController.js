const express=require("express")
const wrapAsync = require("../utils/wrapAsync")
const ExpressError = require("../utils/expressError")

const ReviewCollection = require("../models/Reviews")
const ListingsCollection = require("../models/Listing");


//-------------------------ALL REVIEW APIS-----------------------
//POSTING A NEW REVIEW
module.exports.postReviewRoute=wrapAsync(async(req,res)=>{
    let listing=await ListingsCollection.findById(req.params.id);
    let review=new ReviewCollection(req.body.review);
    console.log("Review body:"+req.body.review);
    review.author=req.user._id;
    
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
    })

    //DELETE A NEW REVIEW
    module.exports.deleteReview=wrapAsync(async(req,res)=>{
        let {id,reviewId} =req.params;
        console.log("I AM IN REVIEW ROUTE"+req.params);
        let res1=await ReviewCollection.findByIdAndDelete(reviewId);
        //FIRST YOU NEED TO REMOVE IT FROM LISTING AS WELL SO PULL[delete] FROM THE LISTING.REVIEWS
        let res2=await ListingsCollection.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    
         //console.log(listingToEdit);
         //USING FLASHES HERE TO RPRESENT NEW LISTING ADDED,HOW DO YOU CRETE IT IS AS BELOW
        //ITS A KEY VALUE PAIR AND YOU USE THIS KEY IN MDW RES.LOCALS SO THT WHEN RENDERED IT AUTOMATICALLY SENT
        req.flash("SUCCESS","REVIEW IS EDITED!")
        //SO WE ARE REDERING /LISTINGS THAT IS INDEX.EJS VIEWS WHERE YOU NEED TO ACCESS THE SUCCESS!
    
    
        res.redirect(`/listings/${id}`);
        })