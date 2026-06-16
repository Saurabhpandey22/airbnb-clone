const wrapAsync = require("../extrathings/wrapAsync.js");
const Listing = require("../models/listing.js");
//index route  ki funcanality hai
module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs",{allListings});
};
module.exports.SearchListings = async (req, res ,next) => {

    let { location } = req.query;

    const allListings = await Listing.find({
        $or: [
            {
                location: {
                    $regex: location,// regrex ka matlab exact match ki jagah text ko search karo jo 
                    // ex( agar sirf united likh de to listins de do)
                    
                    $options: "i" // eska matlab case sensitive nhi chahe jaise
                }
            },
            {
                country: {
                    $regex: location,
                    $options: "i"
                }
            }
        ]
    });
    if(allListings.length===0){
      req.flash("error", " No listings found for this location!");
      return res.redirect("/listings");
    }

    res.render("listings/index.ejs", { allListings });
    next();
};
//new route  ki funcanality hai
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};
//show route  ki funcanality hai
module.exports.showListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id).populate({path:"reviews",
    populate:{path:"author"// path me author ko populate kara rahe hai taki author jo review me random name aa raha hai uski jagah 
    // author(jisne reviewcreate kiya) uska naam aaye
 },
    })
  .populate("owner");
  if(!listing){
    req.flash("error","listing your requested does not exist");
    //console.log(listing);
    res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
};
//create route  ki funcanality hai
module.exports.createListing = wrapAsync(async (req, res, next) => {
  let url = req.file.path;
  let filename = req.file.filename;
 const newListing = new Listing(req.body.listing);
 newListing.owner = req.user._id;
 newListing.image ={url , filename};
  await newListing.save();
  req.flash("success","New listins created !");// eska use karke ham sabhi (delete ,update) me bhi alert de sakte hai
  res.redirect("/listings");
});
//edit route  ki funcanality hai
module.exports.editRenderForm = async (req, res) => {
let { id } = req.params;
const listing = await Listing.findById(id);
console.log(listing);
req.flash("success"," listins edited !");
res.render("listings/edit.ejs", { listing });
};
//update route  ki funcanality hai
module.exports.updateListing =async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, req.body.listing);
  if (typeof req.file !=="undefined"){
  let url = req.file.path;
  let filename = req.file.filename;
  listing.image = {url ,filename};
  await listing.save();
  }
  req.flash("success","listing updated");// success(key hai) aur listing updated(us key ki value hai)
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing =async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success","listing deleted !");
  res.redirect("/listings");
};