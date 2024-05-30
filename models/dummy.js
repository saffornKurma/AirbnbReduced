const  mongoose =require("mongoose");
const Schema=mongoose.Schema;


const DummySchema=new Schema({
    email:{
        type:String,
        required:true,
    }
})
//THIS IS THE PLUGIN USED TO CREATE HASH SALT AND PASSWORD
//AUTOMATICALLY THE PASSPORT MONGOOSE ADDS USERNAME AND ABOVE FIELDS AS DEFAULT IN THE SCHEMA


module.exports=mongoose.model("Dummy",DummySchema);