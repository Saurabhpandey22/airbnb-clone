const express = require("express");
const router = express.Router();

const User = require("../../models/user");
const Listing = require("../../models/listing");
const Review = require("../../models/review");

router.get("/dashboard", async (req,res)=>{

    const totalUsers = await User.countDocuments();

    const totalListings = await Listing.countDocuments();

    const totalReviews = await Review.countDocuments();

    res.render("admin/dashboard.ejs",{
        totalUsers,
        totalListings,
        totalReviews
    });

});

module.exports = router;