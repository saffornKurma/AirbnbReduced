// import {v2 as cloudinary} from 'cloudinary';
//or
const cloudinary=require('cloudinary').v2;
//this is required for storing the multi data in cludinary
const {CloudinaryStorage} =require("multer-storage-cloudinary")
          
cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.API_KEY, 
  api_secret: process.env.API_SECRET 
});


const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'Wanderlust',
    format: async (req, file) => {'png','jpg' ,'jpeg'}// supports promises as well
  },
});

module.exports=storage;

