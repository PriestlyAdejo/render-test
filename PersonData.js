const Person = require("./PersonDB");
const mongoose = require("mongoose");
const CONNECTION_URL = process.env.MONGODB_URL;

let persons = [
	{
		id: 1,
		name: "Arto Hellas",
		number: "040-123456",
	},
	{
		id: 2,
		name: "Ada Lovelace",
		number: "39-44-5323523",
	},
	{
		id: 3,
		name: "Dan Abramov",
		number: "12-43-234345",
	},
	{
		id: 4,
		name: "Mary Poppendieck",
		number: "39-23-6423122",
	},
];

mongoose.set("strictQuery", false);
mongoose.connect(CONNECTION_URL);

const savePersonToDB = async (person) => {
	const newPerson = new Person({
		name: person.name,
		number: person.number,
	});

	try {
		const savedPerson = await newPerson.save();
		console.log("Person saved:", savedPerson);
	} catch (error) {
		console.log("Error saving person:", error);
	}
};

const savePersonsToDB = async () => {
	try {
		await Promise.all(persons.map(savePersonToDB));
		console.log("All persons saved to the database");
	} catch (error) {
		console.log("Error saving persons:", error);
	} finally {
		mongoose.connection.close();
	}
};

Person.find({}).then((result) => {
	result.forEach((person) => {
		console.log(person.name, person.number);
	});

	savePersonsToDB(); // Call the function to save persons after fetching
});

module.exports = savePersonsToDB;
