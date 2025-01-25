const { query, response } = require("express");
const listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({accessToken : mapToken});

module.exports.index = async (req, res) => {
  const all_listings = await listing.find({})
      .populate("owner"); // Populate the owner field for each listing
  res.render("listings/index.ejs", { all_listings });
};



module.exports.renderNewForm = (req,res)=>{
    res.render("listings/new.ejs");
}

module.exports.showListing = async (req,res)=>{
    let {id} = req.params;
    const list = await listing.findById(id)
    .populate({path : "reviews",
      populate : {
        path : "author",
      },
    })
    .populate("owner");
    if(!list){
      req.flash("error","Listing does not exist !!");
      res.redirect("/listings");
    }
    res.render("listings/show.ejs",{list});
}

module.exports.createListing = async (req,res,next)=>{  

   let response =  await geocodingClient.forwardGeocode({
      query : req.body.listing.location,
      limit : 1,
    })
    .send();

  
    let url = req.file.path;
    let filename = req.file.filename;
    const newlisting = new listing(req.body.listing);  
    newlisting.owner  = req.user._id;  
    newlisting.image = {url ,filename}; 
    newlisting.geometry = response.body.features[0].geometry;
    let savedlisting =  await newlisting.save();
    req.flash("success","New listing Created");
    res.redirect("/listings");  
}


module.exports.renderEditForm = async(req,res)=>{
      
    let {id} = req.params;
    const list = await listing.findById(id);
    if(!list){
      req.flash("error","Listing does not exist !!");
      res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{list});   
}


module.exports.updateListing = async(req,res)=>{
    if(!req.body.list){
        throw new express_error(400,"Send valid for listings !!") 
    }
    
    let {id} = req.params;
    let list = await listing.findByIdAndUpdate(id,{...req.body.list});

    if (typeof req.file !== "undefined") {
      let url = req.file.path;
      let filename = req.file.filename;
      list.image = {url ,filename}; 
      await list.save();
    }

    req.flash("success","Listing Updated successfully !!");
    return res.redirect(`/listings/${id}`);
}


module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await listing.findByIdAndDelete(id);
    req.flash("success"," Listing Deleted");
    res.redirect("/listings");
  }