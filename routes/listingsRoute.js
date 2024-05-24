//THIS IS THE CLAUSE FOR
//KNOWING WHICH ENV CURRENTLY WE ARE WORKING ON
//IF ITS" "PRODUCTION" THE DONT USE .ENV
if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}


const express = require("express");
const wrapAsync = require("../utils/wrapAsync")
const ExpressError = require("../utils/expressError")
const router = express.Router();

const storage=require("../cloudinary.js")

//THIS IS LIBRARY CALLED MULTER
//SPECFICALLY USED TO PROCESS MULTI DATA OR FORM DATA SENT IN IN FORM WITH TYPE FILE AND IMAGES
//FOR TESTING WE MAKE IT TO STORE UPLAOD TO TO FOLDER UPLOAD
//BUT LATER WE WILL TRY TO UPLOAD TO CLOUD STORE
const multer=require('multer')
//const upload=multer({dest:'uploads/'})
//FOR TESTING WE WILL CREATE A POST CALL CHECK THE COMMENT TEST_IMAGE TAG BELOW

//STORING USING THE MULTER STORAGE
const upload=multer({storage});

//SAMPLE DATA RES
// {
//     "fieldname": "image",
//     "originalname": "cabin-3374201_1280.jpg",
//     "encoding": "7bit",
//     "mimetype": "image/jpeg",
//     "path": "https://res.cloudinary.com/dr5owrv1x/image/upload/v1716574529/Wanderlust/jnbf0lqqvvnrijyduoka.jpg",
//     "size": 243226,
//     "filename": "Wanderlust/jnbf0lqqvvnrijyduoka"
// }

//const dotenv=require("dotenv")

//THIS IS THE MIDDLEWARE WHICH USES REQ.ISAUTHENTICATE TO FROM PASSPORT LIB TO CHECK A USER IS LOGGED IN 
const { isLoggedIn ,isOwner,validateListings,} = require("../middleware.js");
//WE ARE FOLLOWING MVC PATTERN SO THIS CONTROLLER HAS ALL THE ROUTES
const listingController=require("../controllers/listingController")


//WE ARE USING ROUTER>ROUTE A COMBIE WAY OF WRITING THE APIS
//BASICALLY IT WORKS ON THE BASIS OF CHAINING TOGETHER COMMON ROUTE
//USE-ROUTER.ROUTE("/").get



//---------------------all listing api------------------------
//HERE COMMON PATH IS "/" USED BY GET ALSO POST//U CAN USE THE SAME IN REVIEW AS WELL
//USING CONTROLLERS 
//router
//create new listing
//isLoggedIn check starting comment for this
router.get("/new", isLoggedIn,listingController.newRoute )

router
.route("/:id")
.get( listingController.showOneListing)

router
.route("/:id/edit")
.get(isOwner, isLoggedIn, listingController.editListingRoute)
.put(isOwner, isLoggedIn,listingController.editListingPutRoute)

//show one listing api
//router.get("/:id", listingController.showOneListing)
//edit listing
//router.get("/:id/edit",isOwner, isLoggedIn, listingController.editListingRoute);
//POST new
//router.post("/", isLoggedIn,listingController.newListingRoute)
//PUT edit the listing
//POST new
//router.put("/:id/edit",isOwner, isLoggedIn,listingController.editListingPutRoute)
//Delete Listing
router.delete("/:id/delete",isOwner, isLoggedIn,listingController.deleteRouteListings)

router
.route("/")
.get( listingController.indexRoute)
.post( isLoggedIn,upload.single("image"),listingController.newListingRoute)
//upload is a middlewere
//TEST_IMAGE:IS THE POST CALL WHERE WE USE UPLOAD FUNCTION FROM MULTER IN ORDER TO STORE FILE IN UPLOAD AS IT IS 
//SINGLE IMAGE CHOOSEN SO USE SINGLE WE CAN ALSO USE MULTI FOR MANY FILES
// .post(upload.single("image"),(req,res)=>{
//     res.send(req.file)
// })




module.exports = router;
