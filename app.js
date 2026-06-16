// es codition ka matlab hai ki ham sirf apni.env file ko devlopment ke ander use karenge production me nhi
if(process.env.NODE_ENV !="production"){
  require('dotenv').config();
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const listingsRouter = require("./views/routes/listings.js");
const reviewRouter = require("./views/routes/review.js");
const userRouter = require("./views/routes/user.js");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const user = require("./models/user.js");
// const expressError = require("./extrathings/ExpressError.js");
app.use(methodOverride("_method"));
 const ejsmate = require("ejs-mate");
const review = require("./models/review.js");
const { connect } = require("http2");
app.engine("ejs", ejsmate);
// const mongo_url = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLASDB_URL;
const adminRouter = require ("./views/routes/admin.js");

main()
.then(() => {
  console.log("Connected to MongoDB");
})
.catch((err) => {
  console.error("Error connecting to MongoDB:", err);
});
async function main(){
  await mongoose.connect(dbUrl);
};

// app.get("/", (req, res) => {
//   res.redirect("/listings");
// });
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));//eska matlab hai ki jab bhi form submit hoga to uska data urlencoded format me aayega aur hum usko req.body se access kar sakte hain.
app.use(express.static(path.join(__dirname, "views/public")));

const store = MongoStore.create({
  mongoUrl:dbUrl,
  crypto:{
    secret:process.env.SECRET,
  },
  touchAfter: 24*3600,
});
store.on("error",()=>{
  console.log("Error in mongo session store",err);
})
//  express Sessions ke liye(ye temparary storage me kuch data save karate hai aur session id cookies ke form me frontend ko de deta hai)
const sessionOptions = {
  store,
  secret:process.env.SECRET,
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now() +7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
    httponly:true,
  },
};
app.use(session(sessionOptions));
app.use(flash());// route use karne se pahle ham flash ka use karte hai
// ye ek middleware hai
// ab ham authentication ke liye passport ke middleware aur funcation ko usekarenge
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use("/admin",adminRouter);

app.use((req , res, next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.curruser = req.user;
  next();
});
// demouser ke liye route create karte hai
// app.get("/demouser",async(req,res)=>{
//   let fakeuser =new user({
//     email:"student@gmail.com",
//     username:"rohanmohan",
//   });
//   let registeredUser =  await user.register(fakeuser,"helloworld");
//   res.send(registeredUser);
// });

app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews" , reviewRouter);
app.use("/" ,userRouter);
// app.get("/testlisting", async (req, res) => {
// let samplelisting = new Listing({
//   title:"my new villa",
//   description:"this is a beautiful villa with a pool and a garden",
//   price:1000,
//   location:"Nibavar",
//   country:"India",
// });
// await samplelisting.save();
// console.log("sample listing was saved");
// res.send("successful testing");
// });

//hamne jitne route bnaye hai agar unke alawa kisi route me request aayegi tab
// app.all("/*",(req,res,next)=>{
// next(new expressError(404,"something went worng"))
// });

//middleware to error handling
// app.use((err, req, res, next) => {
//   let{statusCode=401,massage="something went worng"}=err;
//   res.status(statusCode).send(massage);
// });
app.get("/privacy",(req,res)=>{
  res.render("privacy.ejs")
});
app.get("/terms",(req,res)=>{
  res.render("terms.ejs")
});

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
