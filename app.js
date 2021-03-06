const express               = require("express"),
	  app                   = express(),
	  mongoose              = require("mongoose"),
	  flash                 = require("connect-flash"),
	  passport              = require("passport"),
	  moment                = require("moment"),
      bodyParser            = require("body-parser"),
	  expressSession        = require("express-session"),
	  LocalStrategy         = require("passport-local"),
	  methodOverride        = require("method-override"),
	  passportLocalMongoose = require("passport-local-mongoose"),
	  Comment               = require("./models/comment"),
 	  Campground            = require("./models/campground"),
	  User                  = require("./models/user"),
 	  seedDB                = require("./seeds.js");

//ROUTES
const campgroundRoutes  = require("./routes/campgrounds"),
	  commentRoutes     = require("./routes/comments"),
	  indexRoutes       = require("./routes/index");
//-------------------

app.set("view engine" , "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);
mongoose.connect("mongodb://localhost/yelp_camp", { useNewUrlParser: true });

//seedDB();  //seed the database

//PASPORT CONFIG
app.use(expressSession({
	secret            : "Boring this lecture is",
	resave            : false,
	saveUninitialized : false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) =>{
	res.locals.currentUser = req.user;
	res.locals.error       = req.flash("error");
	res.locals.success     = req.flash("success");
	next();
});
app.locals.moment = require('moment');



app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/", indexRoutes);

app.listen("3000",function(){
	console.log("YelpCamp Server");
});
