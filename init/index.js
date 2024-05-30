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

    let ListingsData=Listings.data;
//OTER PARANTHESIS IS REQUIRED IN ORDER TO SAY JS THAT OBJECT CREATION IS NOT A BLOCK OF CODE
ListingsData=ListingsData.map((listData)=>({...listData,owner:"664b69281632fc6409591e6b"}));

    const res=await ListingsCollection.insertMany(ListingsData);
    if(res)
    {
        console.log("Data inserted");
    }
    else{
        console.log("Data insertion failure,please check!");
    }
}


initDB();


