const express = require("express");
const wrapAsync = require("../utils/wrapAsync")
const ExpressError = require("../utils/expressError")
const router = express.Router();


const passport = require("passport");

const { saveRedirectUrl } = require("../middleware");

const userController=require("../controllers/userController");

//create new user
router.get("/signup", userController.getSignUpPage)

//create new user
router.post("/signup", userController.createNewUser)

//login  user
router.get("/login", userController.loginUser)

//login  user
//FAILUREFLASH SHOWS FLASH IF FAILURE
//MDW SAVEREDIRECTURL TO SAVE THE URL GOT IN ISLOGGEDIN 
//THIS IS NEEDED TO STORE IN LOCAL
//SO WE CALL SAVEREDIRECTUSRL MDW
router.post("/login", saveRedirectUrl, passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
}),
userController.login
)

//THIS ROUTE IS USE FOR LOGGINOUT THE USER
//HERE PASSPORT GIVE A FUNCTION REQ>LOGOUT()
//WHICH SERILIZED AND DESERIALIZED DATA WILL BE 
//REMOVED FROM THE SESSION
router.get("/logout", userController.logOut)


module.exports = router;