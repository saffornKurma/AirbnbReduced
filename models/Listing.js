const  mongoose =require("mongoose");

const User=require("./User")
const Review=require("./Reviews")



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
        path:String,
        filename:String,
        
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
    },
    reviews:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Review"
    }],
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }

})

ListingSchema.post("findOneAndDelete",async (listing)=>{

    console.log("POST MIDDLE WARE CALLED");
if(listing)
    await Review.deleteMany({_id:{$in:listing.reviews}})


})



const Listings=mongoose.model("Listings",ListingSchema);

module.exports=Listings;