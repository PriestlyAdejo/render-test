const mongoose = require("mongoose");

if (process.argv.length < 3) {
	console.log("give password as argument");
	process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://priestly101:${password}@mongotest.g7pt5gh.mongodb.net/personApp?retryWrites=true&w=majority`;
mongoose.set("strictQuery", false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
	name: String,
	number: String,
});

const Person = mongoose.model("Person", personSchema);

// If no extra parameters are specified
if (!process.argv[3] && !process.argv[4]) {
	console.log("phonebook:");
	Person.find({}).then((result) => {
		result.forEach((person) => {
			console.log(person.name, person.number);
		});
		mongoose.connection.close();
	});
	process.exit(1);
} else if (process.argv[3] && process.argv[4]) {
	const person = new Person({
		name: process.argv[3],
		number: process.argv[4],
	});

	person
		.save()
		.then(() => {
			console.log("Person saved:", person);
			mongoose.connection.close();
		})
		.catch((error) => {
			console.log("Error saving person:", error);
			mongoose.connection.close();
		});
}
