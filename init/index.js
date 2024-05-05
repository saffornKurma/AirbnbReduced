const mongoose=require("mongoose");
const Listings=require("./data")

const ListingsCollection=require("../models/Listing")

const main=async ()=>await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');


main().then(()=>{
    console.log(`DB connection success`);
}).catch(err=>{
    console.log(err);
})





const initDB=async ()=>{

    await ListingsCollection.deleteMany({});

    const res=await ListingsCollection.insertMany(Listings.data);
    if(res)
    {
        console.log("Data inserted");
    }
    else{
        console.log("Data insertion failure,please check!");
    }
}


initDB();


