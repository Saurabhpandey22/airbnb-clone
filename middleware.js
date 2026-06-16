const Listing  = require("./models/listing");
const review = require("./models/review");
const {listingSchema,reviewSchema} = require("./schema.js");
module.exports.isLoggedIn = (req ,res ,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl =req.originalUrl;
        req.flash("error","you must be logged in to create listing!");
        return res.redirect("/login");
    }
    next();
}
// es use esliye kiya gya hai taki agar ham add new listing me click karke login kare to login ke baad vahi route khule /listing route nhi
module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};
// ye middleware esliye crete kiya gaya hai taki listings ko sirf vahi user edit aur delete kar sake jiski listing ho dusra nhi
module.exports.isowner = async(req,res,next)=>{
    let{id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.curruser._id)){
        req.flash("error","you are not the owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}
//ye middleware esliye crete kiya gaya hai taki reviews ko sirf vahi user edit aur delete kar sake jiska review ho dusra nhi
module.exports.isReviewAuthor = async(req,res,next)=>{
    let{id, reviewId} = req.params;
    let Review = await review.findById(reviewId);
    if(!Review.author.equals(res.locals.curruser._id)){
        req.flash("error","you are not the owner of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}