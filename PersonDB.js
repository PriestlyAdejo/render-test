const mongoose = require("mongoose");
require("dotenv").config();

const CONNECTION_URL = process.env.MONGODB_URL;
console.log("CONNECTION_URL:", CONNECTION_URL, "BALLSSSSSSS/n/n/n/n/n/n/n/n/n");

if (!CONNECTION_URL) {
	console.log("CONNECTION_URL not set in env variables");
	process.exit(1);
}

mongoose
	.set("strictQuery", false)
	.connect(CONNECTION_URL)
	.then(() => {
		console.log("Connected to MongoDB");
	})
	.catch((error) => {
		console.log("Error connecting to MongoDB:", error.message);
	});

const personSchema = new mongoose.Schema({
	name: String,
	number: String,
});

personSchema.set("toJSON", {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
	},
});

const Person = mongoose.model("Person", personSchema);

module.exports = Person;
