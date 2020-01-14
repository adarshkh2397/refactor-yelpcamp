const express = require("express"),
	  router  = express.Router();
	  
const Campground = require("../models/campground"),
	  middleware = require("../middleware");
	

router.get("/",(req,res) => {
	Campground.find({},function(err,campgrounds){
		if(err){
			console.log(err);
		}else{
			res.render("campgrounds/index",{campgrounds:campgrounds});
		}
	})
});

router.post("/" , middleware.isLoggedIn , (req,res) => {
	var name = req.body.name;
	var image = req.body.image;
	var price = req.body.price;
	var desc = req.body.description;
	var author = {
		id       : req.user._id,
		username : req.user.username
	};
	//var newCampground = {name : name , image : image};
	Campground.create({
		name :  name , 
		image : image ,
		price : price ,
		description : desc ,
		author : author
		},function(err,campground){
			if(err){
				console.log(err);
			}else{
				res.redirect("/campgrounds");
			}
	});
});

router.get("/new" , middleware.isLoggedIn, (req,res) => {
	res.render("campgrounds/new");
});

router.get("/:id", (req,res) => {
	Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
		if(err){
			console.log(err);
		}else{
			res.render("campgrounds/show",{campground:foundCampground});
		}
	})
});

router.get("/:id/edit", middleware.checkCampgroundOwnership, (req, res) => {
	Campground.findById(req.params.id , (err ,foundCampground) => {
		if(err){
			res.redirect("back");
		} else {
			res.render("campgrounds/edit" , {campground:foundCampground});
		} 
	});	
});

router.put("/:id" , middleware.checkCampgroundOwnership, (req,res) => {
	Campground.findByIdAndUpdate(req.params.id, req.body.campground,  (err,campground) => {
		if(err){
			res.redirect("back");
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

router.delete("/:id", middleware.checkCampgroundOwnership, (req,res) => {
	Campground.findByIdAndRemove(req.params.id , (err) => {
		if(err){
			res.redirect("back");
		} else {
			res.redirect("/campgrounds");
		}
	});
});

module.exports = router ;