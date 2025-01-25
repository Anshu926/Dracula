const express = require("express");
const router = express.Router();
const wrap_async = require("../utils/wrapAsync.js");
const listing = require("../models/listing.js");
const {isloggedin, isOwner,validateListing} = require("../middleware.js");
const listingController = require("../Controllers/listings.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});


//INDEX  ROUTE
router.get("/",  wrap_async( listingController.index ));
  
  
  //NEW  ROUTE
  router.get("/new",isloggedin,listingController.renderNewForm);
  

  //SHOW ROUTE
  router.get("/:id",wrap_async( listingController.showListing));

  
  // CREATE ROUTE 
  router.post("/",isloggedin,
    upload.single("listing[image]"),
    wrap_async(listingController.createListing)
  );
  
  //EDIT ROUTE
  router.get("/:id/edit",isloggedin,isOwner,wrap_async(listingController.renderEditForm));
  
  //UPDATE ROUTE
  router.put("/:id",isloggedin, isOwner, 
    upload.single("listing[image]"),
    wrap_async( listingController.updateListing));
  
  //DELETE ROUTE 
  router.delete("/:id",isloggedin,isOwner, wrap_async( listingController.destroyListing) );

  
 module.exports = router;