const express=require("express")
const wrapAsync = require("../utils/wrapAsync")
const ExpressError = require("../utils/expressError")

const ListingsCollection = require("../models/Listing");

const mapBoxAccessToken=process.env.MAPBOX_API_KEY;

const mbxGeocoding=require("@mapbox/mapbox-sdk/services/geocoding");

const geoCodingClient = mbxGeocoding({ accessToken: mapBoxAccessToken });



//THIS IS THE MAP SDK FOR GEOCODING FROM LOCATION DATA TO LAT AND LONGS

//index page
module.exports.indexRoute=wrapAsync(async (req, res) => {
    console.log("I AM LISTING ALL");
    const allListings = await ListingsCollection.find({});

    res.render("listings/index.ejs", { allListings });
})

//new page
module.exports.newRoute=async (req, res) => {
console.log("new route");
    res.render("listings/new.ejs");
}

//show one listing on click
module.exports.showOneListing=wrapAsync(async (req, res) => {
    let { id } = req.params;
//WE ARE NESTING POPULATE WITH PATH:REVIEWS PATH LATER POPULATE AUTHOR
//THE BELOW SAYS FOR ALL REVIEWS POPULATE AUTHOR TOO
//OBSERVE ITS NESTED POPULATE
    const onelisting = await ListingsCollection.findById(id).populate({path:"reviews",populate:{path:"author"},}).populate("owner");

    if (!onelisting) {
        req.flash("ERROR", "LISTING DOESNT EXIST/ALREADY DELETED! ");
        res.redirect("/listings");
        return;
    }
    res.render("listings/showOne.ejs", { onelisting });
});

//EDIT the listing
module.exports.editListingRoute=wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listingToEdit = await ListingsCollection.findById(id);
    if (!listingToEdit) {
        req.flash("ERROR", "LISTING DOESNT EXIST/ALREADY DELETED! ");
        res.redirect("/listings");
        return;
    }
    //USING FLASHES HERE TO RPRESENT NEW LISTING ADDED,HOW DO YOU CRETE IT IS AS BELOW
    //ITS A KEY VALUE PAIR AND YOU USE THIS KEY IN MDW RES.LOCALS SO THT WHEN RENDERED IT AUTOMATICALLY SENT
    req.flash("SUCCESS", "LISTING IS EDITTED!");
    //SO WE ARE REDERING /LISTINGS THAT IS INDEX.EJS VIEWS WHERE YOU NEED TO ACCESS THE SUCCESS!
    res.render("listings/edit.ejs", { listingToEdit });
})

//NEW post listing
module.exports.newListingRoute=wrapAsync(async (req, res) => {

    let { title, description, price, location,country } = req.body;
    const owner=req.user._id;

    //NOTE:REMEBER WE GET IMAGE IN FILE TYPES IN REQ.FILE SENT FROM UI
    const {filename,path}=req.file;

   //THIS COMPLETE IS MPABOX GEO CODING CODE
   let responseGeo=await geoCodingClient.forwardGeocode({
    query: location,
    limit: 1
  })
    .send();

    // let latitude=responseGeo.body.features[0].geometry[0];
    // let longitude=responseGeo.body.features[0].geometry[1];

    let geometry=responseGeo.body.features[0].geometry;

   //

    let response = await ListingsCollection.create({ title, description, price, geometry,location, country ,owner,image:{filename,path}})
    //let response=await ListingsCollection.create()

    //USING FLASHES HERE TO RPRESENT NEW LISTING ADDED,HOW DO YOU CRETE IT IS AS BELOW
    //ITS A KEY VALUE PAIR AND YOU USE THIS KEY IN MDW RES.LOCALS SO THT WHEN RENDERED IT AUTOMATICALLY SENT
    req.flash("SUCCESS", "NEW LISTING IS ADDED!")
    //SO WE ARE REDERING /LISTINGS THAT IS INDEX.EJS VIEWS WHERE YOU NEED TO ACCESS THE SUCCESS!
    res.redirect("/listings");
})

//PUT EDIT
module.exports.editListingPutRoute=wrapAsync(async (req, res) => {
    let { id } = req.params;

    let { title, description, price, location, country } = req.body;

    const {filename,path}=req.file;

    let listingToUpdate = await ListingsCollection.findByIdAndUpdate(id, { title, description, price, location, country })

    if(typeof filename != "undefined" && typeof path != "undefined")
    {
        let response=await await ListingsCollection.findByIdAndUpdate(id, { title, description, price, location, country ,image:{filename,path}});

    }

    

//console.log("after edit new link "+response);


    res.redirect("/listings");
})

//DELETE ROUTE LISTINGS
module.exports.deleteRouteListings=wrapAsync(async (req, res) => {
    let { id } = req.params;
    //let {title,description,price,location,country}=req.body;
    let response = await ListingsCollection.findByIdAndDelete(id)
    //USING FLASHES HERE TO RPRESENT NEW LISTING ADDED,HOW DO YOU CRETE IT IS AS BELOW
    //ITS A KEY VALUE PAIR AND YOU USE THIS KEY IN MDW RES.LOCALS SO THT WHEN RENDERED IT AUTOMATICALLY SENT
    req.flash("SUCCESS", "LISTING IS DELETED!")
    //SO WE ARE REDERING /LISTINGS THAT IS INDEX.EJS VIEWS WHERE YOU NEED TO ACCESS THE SUCCESS!
    res.redirect("/listings");
})