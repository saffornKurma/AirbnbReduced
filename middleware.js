const { Router } = require("express");
const ListingsCollection=require("./models/Listing")
const ReviewCollection=require("./models/Reviews")
const express = require("express");
const ExpressError = require("./utils/expressError")
//JOI Validation
const ReviewJoiSchema=require("./schema.js")

module.exports.isLoggedIn = (req, res, next) => {
//YPU WILL ALWAYS GET USER INFO IF HE IS LOGGED IN
//FROM THE COOKIES SESSION

//YOU MIGHT HAVE OBSERVED WHEN YOU TRY TO DO EDIT PAGE 
//WITH OUT LOGGIN IT WILL REDIRECT TO LOGGIN PAGE
//BUT ONCE YOU LOGGIN THEN IT DOESNT TAKE YOU BACK TO EDIT
//INORDER TO DO THIS WE NEED TO SEE WHAT ROUTE THE USER WAS TRYING TO ACCESS
//AND  THAT CAN BE GOT IN REQ.ORIGINAL URL TRY TO PRINT YOU WILL GET IT
//AND WE ARE STORING IT IN PASSPORTS SESSION SO THAT WHEN GOING TO OTHER PAGE YOU NEED TO SAVE SOMEWHERE

req.session.redirectUrl=req.originalUrl;
//BUT ABOVE HAS ONE PROBLEM
//PASSPORT AFTER LOGGIN WILL DELETE SESSION SO IT WONT BE ACCESSEBLE
//FOR THIS YOU STORE IT IN REQ.LOCALS
//CHACK NECT MIDDLEWARE WHERE WE ARE STORING IT
    console.log("6"+req.user);
    if (!req.isAuthenticated()) {
        req.flash("ERROR", "Please login")
        return res.redirect("/login");
    }
    next();
}

//THIS MDW IS USED FOR VALIDATION OF MESSAGES THAT IS GOING TO BE STORED IN DB
module.exports.validateListings = (req, res, next) => {
    const { error } = ListingJoiSchema.validate(req.body);
    if (error) {
        throw new ExpressError(400, error)
    }
    else {
        next();
    }
}

module.exports.validateReviews=(req,res,next)=>{
    const {error}=ReviewJoiSchema.validate(req.body);
    if(error)
    {
        throw new ExpressError(400,error);
    }

    next();
}

module.exports.saveRedirectUrl=(req,res,next)=>{
//CHECK ABOVE MDW COMMENT
//IF WE HAVE SESSION DATA THEN STORE IN LOCAL
//YOU WILL USE THIS MDW WHILE LOGIN Router//CHECK LOGIN ROUTE
    if(req.session.redirectUrl)
    {
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}


//THIS MDW IS BASICALLY USED TO BEFORE EDIT OR DELETE 
//WHERE U NEED TO FIND WHO IS THE OWNER OF THE TASK 
module.exports.isOwner=async (req,res,next)=>{
    const {id}=req.params;
    const listing=await ListingsCollection.findById(id);
//res.locals.currUser can be accessed from any where
console.log("isOwner called "+id);
    if(res.locals.currUser && !listing.owner._id.equals(res.locals.currUser._id))
    {
        req.flash("ERROR","Only owners can Change/Delete");
        return res.redirect(`/listings/${id}`);
    }
        next();
    }

    //THIS MDW IS BASICALLY USED TO BEFORE EDIT OR DELETE 
//WHERE U NEED TO FIND WHO IS THE OWNER OF THE REVIEW 
module.exports.isReviewAuthor=async (req,res,next)=>{
    const {id,reviewId}=req.params;
    const review=await ReviewCollection.findById(reviewId);
//res.locals.currUser can be accessed from any where
console.log("isOwner called "+id);
    if(res.locals.currUser && !review.author._id.equals(res.locals.currUser._id))
    {
        req.flash("ERROR","Only authors of the review can Change/Delete");
        return res.redirect(`/listings/${id}`);
    }
        next();
    }