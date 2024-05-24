const express=require("express");
//WE ARE FOLLOWING MVC PATTERN SO THIS CONTROLLER HAS ALL THE ROUTES
const reviewController=require("../controllers/reviewController")
//MERGE PARAMS IS REQUIRED TO ACCESS THE PARENT ID HERE OF LISTINGS IN ROUTER OF CHILD
const router=express.Router({mergeParams:true});
const { isLoggedIn ,isOwner,validateReviews,isReviewAuthor} = require("../middleware.js");
//reviews
//post a new review
router.post("/",isLoggedIn,validateReviews,reviewController.postReviewRoute)
//delete review and clear listing 
router.delete("/:reviewId",isReviewAuthor,reviewController.deleteReview)
    
module.exports=router;