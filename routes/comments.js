const express = require("express"),
	  router  = express.Router({mergeParams : true});

const Campground = require("../models/campground"),
	  Comment    = require("../models/comment"),
	  middleware = require("../middleware");

router.get("/new" ,middleware.isLoggedIn, (req,res) => {
	Campground.findById(req.params.id , (err,foundCampground) => {
		if(err){
			console.log(err);
		} else {
			res.render("comments/new",{campground:foundCampground});
		}
	});
});

router.post("/" ,middleware.isLoggedIn, (req,res) => {
	Campground.findById(req.params.id , (err,campground) => {
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		} else {
			Comment.create(req.body.comment , (err,comment) => {
				if(err){
					req.flash("error", "Something went wrong");
					console.log(err);
				} else {
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					campground.comments.push(comment);
					campground.save();
					req.flash("success", "Comment added");
					res.redirect("/campgrounds/"+campground._id);
				}	
			});
		}
	});
});

router.get("/:comment_id/edit", middleware.checkCommentOwnership, (req,res) => {
	Campground.findById(req.params.id, (err,foundCampground) => {
		if(err){
			res.redirect("back");
		} else {
			Comment.findById(req.params.comment_id , (err,foundComment) => {
				if(err){
					res.redirect("back");
				} else {
					res.render("comments/edit" , {comment:foundComment , campground:foundCampground});
				} 
			});
		}
	});
});

router.put("/:comment_id" , middleware.checkCommentOwnership, (req,res) => {
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment ,  (err,comment) => {
		if(err){
			res.redirect("back");
		} else {
			res.redirect("/campgrounds/" + req.params.id );
		}
	});
});

router.delete("/:comment_id", middleware.checkCommentOwnership , (req,res) => {
	Comment.findByIdAndRemove(req.params.comment_id , (err) => {
		if(err){
			res.redirect("back");
		} else {
			req.flash("success", "Comment Deleted");
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});


module.exports = router ;