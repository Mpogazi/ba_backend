const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cookieParser = require("cookie-parser");
const csrf = require("csurf");
const session = require("express-session");
const crypto = require("crypto");
const helmet = require("helmet");
const currency = require("./utils/currency");
const app = express();

var { redisStore } = require("./config/redis");
var { time_hk, get_yf_end_date } = require("./utils/time");
var mongo_uri = "mongodb://127.0.0.1:27017/";

var mongoose = require("mongoose");
mongoose.set("useCreateIndex", true);
mongoose
	.connect(mongo_uri, { useUnifiedTopology: true, useNewUrlParser: true })
	.then(() => console.log("MongoDb Connected ..."))
	.catch((error) => {
		throw error;
	});
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDb Connection error"));
app.set("trust proxy", 1);
var expiryDate = new Date(Date.now() + 60 * 60 * 1000); // 2 hour (Time in GMT)
app.use(
	session({
		secret: crypto.createHash("sha256").update("bowen_users").digest("hex"),
		name: "sessionId",
		resave: true,
		saveUninitialized: true,
		cookie: {
			secure: false, // Will set it to true after I get to https
			httpOnly: true,
			expires: expiryDate,
		},
		store: redisStore,
	})
);
app.use(helmet());

const stocksController = require("./controllers/ccass/stock.controller");
const holdingsController = require("./controllers/ccass/holdings.controller");
const summaryController = require("./controllers/ccass/summary.controller");
const userController = require("./controllers/user/user.controller");
const errorHandlerController = require("./controllers/reporting/error.controller");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "http://localhost:4200");
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept"
	);
	next();
});

var requireLogin = (req, res, next) => {
	// if(!req.session.user) {
	//     res.send('You need to login');
	//     return;
	// }
	next();
};

app.get("/", (req, res) => {
	// res.cookie('-XSRF-TOKEN', req.csrfToken());
	res.send(get_yf_end_date());
});

app.get("/test_auth", requireLogin, (req, res) => {
	res.send("Successfully logged In!");
});
app.get(
	"/holdings_between_dates/:start_date/:end_date/:code",
	requireLogin,
	holdingsController.getHoldingsWithDate
);
app.get("/all_ccass_dates", requireLogin, holdingsController.getAllDates);
app.get("/holdings/", requireLogin, holdingsController.getHoldings);
app.get("/stock", requireLogin, stocksController.getStock);
app.get("/static_stock_info", requireLogin, stocksController.getStatic);
app.get(
	"/historical_stock_info/:yf_code",
	requireLogin,
	stocksController.getHistorical
);
app.post(
	"/add_watchlist_participant",
	requireLogin,
	userController.addWatchlistParticipant
);
app.post(
	"/add_watchlist_stock",
	requireLogin,
	userController.addWatchlistStock
);

app.get("/summary", requireLogin, summaryController.getSummary);

app.post("/signup", userController.signupUser);
app.post("/login", userController.signinUser);
app.get("/logout", requireLogin, userController.logout);

app.post("/error-report", errorHandlerController.logError);

const port = process.env.PORT || 1400;
app.listen(port, console.log("App running on ", port));
