const express = require("express");
const wrapAsync = require("../utils/wrapAsync")
const ExpressError = require("../utils/expressError")
const router = express.Router();
const User = require("../models/User");

const passport = require("passport");

const { saveRedirectUrl } = require("../middleware");


//create new user
router.get("/signup", async (req, res) => {

    res.render("user/signup.ejs");
})


//create new user
router.post("/signup", wrapAsync(async (req, res) => {
    console.log("POST REQ FOR USER");
    try {
        const { username, email, password } = req.body;
        const NewUser = new User({
            username, email
        })
        const registeredUser = await User.register(NewUser, password);
        console.log(registeredUser);
        //THIS REQ.LOGIN IS USED WHEN YOU SIGNED IN NOW AUTOMATICALLY
        //YOU NEED TO BE LOGGIN AND SENT TO THE APPROPRIATE PAGE
        //REQ.LOGIN IS AGAIN A PASSPORT METHOD
        //IT TAKES REGISTERED USER
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("SUCCESS", "CONGRATULATIONS YOU ARE REGISTERED!")
            res.redirect("/Listings")
        })

    }
    catch (e) {
        req.flash("ERROR", e.message)
        res.redirect("/signup");
    }
})
)


//login  user
router.get("/login", async (req, res) => {

    res.render("user/login.ejs");
})


//login  user
//FAILUREFLASH SHOWS FLASH IF FAILURE

//MDW SAVEREDIRECTURL TO SAVE THE URL GOT IN ISLOGGEDIN 
//THIS IS NEEDED TO STORE IN LOCAL
//SO WE CALL SAVEREDIRECTUSRL MDW
router.post("/login", saveRedirectUrl, passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
}),
    async (req, res) => {

        //PREVIOUSLY WE USED TO DEFAULT TO /LISTINGS
        //res.redirect("/Listings")
        //NOW WE DIRECT TO WHERE WE TRY TO ACCESS AND CAME TO LOGIN AND GO BAC(EDITPAGE->LOGIN->EDITPAGE)
        //ONE FLAW IF YOU TRY TO LOGIN FROM HOME PAGE 
        //ISLOGGEDIN MDW IS NEVER CALLED IF ITS NOT CALLED THEN ORIGINALURL IS NOT SAVED 
        //SO ALWAYS CHECK IF IT EXISTS THEN ONLY REDIRECT
        if (res.locals.redirectUrl) {
            req.flash("SUCCESS", "YOU ARE LOGGED IN!")
            res.redirect(res.locals.redirectUrl)
        }
        else
            res.redirect("/Listings")
    }
)


//THIS ROUTE IS USE FOR LOGGINOUT THE USER
//HERE PASSPORT GIVE A FUNCTION REQ>LOGOUT()
//WHICH SERILIZED AND DESERIALIZED DATA WILL BE 
//REMOVED FROM THE SESSION
router.get("/logout", (req, res, next) => {
    console.log(("hitting logout user"));
    //IF ERR THEN RETURN <MOST OF THE TIME YOU WONT GET ERROR
    //REQ.LOGOUT IS PASSPORT LIB STATIC FUNCTION
    req.logout((err) => {
        if (err) return next(err);
    })

    req.flash("SUCCESS", "YOU ARE LOGGED OUT");
    res.redirect("/listings");

})


module.exports = router;