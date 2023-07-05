const morgan = require("morgan");
const fs = require("fs");
const path = require("path");

// Logger and Configs
// create a write stream (in append mode)
const accessLogStream = fs.createWriteStream(
	path.join(__dirname, "access.log"),
	{
		flags: "a",
	}
);

// Define a custom token to log request body data
morgan.token("req-body", (req) => JSON.stringify(req.body));

// Create a custom skip function to exclude GET requests
const skipFunction = (req, res) => {
	if (req.method === "POST") {
		console.log("Request body:", req.body);
	}
	return false;
};

// Logger and Configs
const logger = morgan(
	":method :url :status :res[content-length] - :response-time ms :req-body",
	{ stream: accessLogStream, skip: skipFunction }
);

module.exports = logger;
