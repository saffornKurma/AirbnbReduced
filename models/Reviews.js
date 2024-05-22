const  mongoose =require("mongoose");
const Schema=mongoose.Schema;


const ReviewSchema=new Schema(
    {
        comment:String,
        rating:{
            type:Number,
            min:1,
            max:5
        },
        created_At:{
            type:Date,
            default:Date.now(),
        }
    }
)

const Review=mongoose.model("Review",ReviewSchema);
module.exports=Review;