// hamne app. js ke code ko listings.js me rakh diya hai taki code padne me complex na lae
const express = require("express");
const router = express.Router();//esse hamari router object aa jayegi
const wrapAsync = require("../../extrathings/wrapAsync.js");
const { listingSchema , reviewSchema} = require("../../schema.js");
const Listing = require("../../models/listing.js");
const {isLoggedIn ,isowner} = require("../../middleware.js");
const listingControllers = require("../../controllers/listings.js");
const multer  = require('multer')
const {storage} = require("../../cloudConfig.js");
const upload = multer({ storage });

// ye("/")  vale same route ko combaine karne ke liye
router
.route("/")
.get(wrapAsync(listingControllers.index))//index route
 .post(isLoggedIn,
    upload.single("listing[image]"),
     listingControllers.createListing);//create route

//new route
router.get("/new",isLoggedIn ,listingControllers.renderNewForm );
// ye route navbar me jo search button hai uske liye listing seach karne ke liye hai
router.get("/search",listingControllers.SearchListings);

//  ye ("/:id")(es route se start hone vale sabhi callback yaha aa gaye hai) vale same route ko combain karne ke liye router.route("/:id")
router
.route("/:id")
.get(listingControllers.showListing)//show route ke liye
.put(isLoggedIn, isowner,
    upload.single("listing[image]"),// image ko edit karne uplode karne ke liye
    listingControllers.updateListing)//update route ke liye
.delete(isLoggedIn,isowner, listingControllers.destroyListing);//delete route ke liye

//edit route
router.get("/:id/edit",isLoggedIn,isowner, listingControllers.editRenderForm);
module.exports = router;// router object ko export kiya hai