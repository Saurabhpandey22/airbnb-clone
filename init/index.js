const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const { init } = require("moongose/models/user_model.js");
const mongo_url = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(mongo_url);
}

const initDB = async () => {
    try{
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj)=>({...obj ,owner:"6a2a872fa96205869f87bfe4"}));
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
} catch (err) {
  console.log(err);
}
};

initDB();