const mongoose = require("mongoose");
const review = require("./review.js");
const Schema = mongoose.Schema;
const listingSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    description:String,
    image:{
        filename: String,
        url:String,
    },
    price:Number,
    location:String,
    country:String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review",
        },
    ],
    // yaha schema ke andar ek owner ko bhi add kiya ja raha hai jiska type ye hai aur ref user(yahi user schema se connect karna) hoga kiyuki jo user hai vahi owner hoga
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
    
});
//mongoose middleware
listingSchema.post("findOneAndDelete",async(Listing)=>{
    if(Listing){
        await review.deleteMany({_id:{$in: Listing.reviews}})
    }
});
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
