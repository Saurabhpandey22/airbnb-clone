const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
// cloudinary ko configure kiya hai that's means .env ki sath joda hai
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});
// yaha hamne storae ko define kiya hai
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'wanderlust_DEV',
    allowedformats: ["png" , "jpg","jpeg"],// yaha hamne image aplode ka formate banya hai ki etnitype ki imae ko ham uplode karenge
  },
});
// ham yaha se cloudnairy, storage ko exports karna chah rahe hai
module.exports = {
     cloudinary,
       storage,
}