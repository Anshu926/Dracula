const listing = require("./models/listing.js");
const Review = require("./models/review.js");
const {listingSchema} = require("./schema.js")
const express_error = require("./utils/ExpressError.js");
const { reviewSchema} = require("./schema.js")

module.exports.isloggedin = (req,res,next)=>{
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","You must logged in first !");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req,res,next) =>{
        if (req.session.redirectUrl) {
            res.locals.redirectUrl =  req.session.redirectUrl;
        }
        next();
};

module.exports.isOwner = async(req,res,next) =>{
    let {id} = req.params;
    u_listing = await listing.findById(id);
    if (!u_listing.owner.equals(res.locals.currentUser._id)) {
        req.flash("error","You are not the owner of this listong");
        return res.redirect(`/listings/${id}`);
      }
      next();
};

module.exports.validateListing = (req,res,next) =>{
    

    let {error} = listingSchema.validate(req,body);
    if(error){
        let err_msg = error.details.map((el) =>el.message).join(",");
        throw new express_error(400,err_msg);
    }  else{
        next();
    }
   
};
module.exports.validateReview = (req,res,next) =>{
    let {error} = reviewSchema.validate(req,body);
    if(error){
        let err_msg = error.details.map((el) =>el.message).join(",");
        throw new express_error(400,err_msg);
    }  else{
        next();
    }
   
};

module.exports.isReviewAuthor = async(req,res,next) =>{
    let {id , reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if (!review.author.equals(res.locals.currentUser._id)) {
        req.flash("error","You are not the author of this review");
        return res.redirect(`/listings/${id}`);
      }
      next();
};