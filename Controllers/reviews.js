const listing = require("../models/listing.js");
const Review = require("../models/review.js");


module.exports.createReview = async(req,res)=>{
    let lust = await listing.findById(req.params.id);
    let new_review = new Review(req.body.review);
    new_review.author = req.user._id;
    lust.reviews.push(new_review);
    await new_review.save();
    await lust.save();
    req.flash("success","New review Created");
    res.redirect(`/listings/${lust._id}`);
 }


 module.exports.destroyReview = async(req,res)=>{
    let {id , reviewId} = req.params;
    await listing.findByIdAndUpdate(id,{$pull : {reviews : reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success"," Review Deleted");
    res.redirect(`/listings/${id}`);
}

