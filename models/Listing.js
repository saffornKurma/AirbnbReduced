const  mongoose =require("mongoose");



const ListingSchema=mongoose.Schema({
    title:
    {
        type:String,
        required:true
    },
    description:{
        type:String
        
    },
    image:{
        default:"https://pixabay.com/photos/woman-portrait-fashion-pink-model-8277925/",
        type:String,
        set:(v)=>v===""?"https://pixabay.com/photos/woman-portrait-fashion-pink-model-8277925/":v,
        
    },
    price:{
        type:Number,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    country:{
        type:String,
        required:true
    }
})


const Listings=mongoose.model("Listings",ListingSchema);

module.exports=Listings;