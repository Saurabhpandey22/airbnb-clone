const user = require("../models/user.js");
const wrapAsync = require("../extrathings/wrapAsync.js");
module.exports.renderSignup = (req ,res)=>{
    res.render("users/signup.ejs");
}
module.exports.Signup =  wrapAsync(async(req ,res)=>{
    try{
         let{username,email,password}=req.body;
    const newUser =new user({email , username});
    const reisteredUser = await user.register(newUser ,password);
    console.log(reisteredUser);
    req.login(reisteredUser ,(err)=>{ // eska use seliye kiya gaya ki agar user ek baar singup kar jaye to usse alag se login na karna pade vo automatic loin ho jaye 
        if(err){
            return next(err);
        }
        req.flash("success" ,"welcome to Wanderlust!");
         res.redirect("/listings");
    });
    }catch(e){
        req.flash("error" ,e.massage);
        res.redirect("/signup");
    }
});

module.exports.renderLoginForm = (req, res)=>{
    res.render("users/login.ejs");
};

module.exports.login = async(req ,res)=>{
    req.flash("success" ,"welcome back to wanderlust!");
    let redirectUrl =res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};
module.exports.logout = (req ,res ,next)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
req.flash("success","you are logged out");
res.redirect("/listings");
    });
};