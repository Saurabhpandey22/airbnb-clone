const express = require("express");
const router = express.Router();
const user = require("../../models/user.js");
const wrapAsync = require("../../extrathings/wrapAsync.js");
const passport = require("passport");
const{saveRedirectUrl} = require("../../middleware.js");
const  usercontroller  = require("../../controllers/users.js");
router.get("/signup",usercontroller.renderSignup);
router.post("/signup",usercontroller.Signup);
//login form ke liye get aur post request
router.get("/login" ,usercontroller.renderLoginForm);

router.post("/login",saveRedirectUrl, passport.authenticate("local" , {failureRedirect:"/login",
    failureFlash:true ,
}), 
usercontroller.login);
router.get("/logout",usercontroller.logout);
module.exports = router;