const express  = require("express"),
	  router   = express.Router(),
	  passport = require("passport");
		
const User = require("../models/user");
	
router.get("/", (req,res) => {
	res.render("landing");
});



//==================
//AUTH ROUTES
//==================

router.get("/register",(req,res) => {
	res.render("register");
});

router.post("/register",(req,res) => {
	var newUser = new User ({username : req.body.username});
	User.register(newUser, req.body.password, (err,user) => {
		if(err){
			req.flash("error", err.message);
			return res.redirect("/register");
		}
		passport.authenticate("local")(req, res, () =>{
			req.flash("success", "Welcome to Yelpcamp " + user.username);
			res.redirect("/campgrounds");
		});
	});
});

router.get("/login" , (req, res) => {
	res.render("login");
});

router.post("/login", passport.authenticate("local",{
	successRedirect : "/campgrounds",
	failureRedirect : "/login"
}), (req,res) => {
});

router.get("/logout" , (req,res) => {
	req.logout();
	req.flash("success", "You are now logged out");
	res.redirect("/campgrounds");
});



module.exports = router ;