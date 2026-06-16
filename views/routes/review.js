const express = require("express");
const ExpressError = require("../../extrathings/ExpressError.js")
const router = express.Router({mergeParams:true});//mergeParams ka use esliye kiya gaya taki hamare review add ho sake
const wrapAsync = require("../../extrathings/wrapAsync.js");
const Review = require("../../models/review.js");
const Listing = require("../../models/listing.js");
const { listingSchema , reviewSchema} = require("../../schema.js");
const { isLoggedIn, isReviewAuthor } = require("../../middleware.js");
const  Reviewcontroller  = require("../../controllers/reviews.js");
const validateReview = (req ,res , next)=>{
  let {error} = reviewSchema.validate(req.body);
  if(error){
    let errmsg =error.details.map((el)=>el.message).join(",");
    throw new ExpressError (400 , errmsg);
  }else{
    next();
  }
  
};
//Reviews (ke andar ek post route create kar rahe hai)
//post route
router.post("/", isLoggedIn,validateReview,Reviewcontroller.createReview);
//delete  reviews route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,Reviewcontroller.destroyReview);
module.exports = router;
