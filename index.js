const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");
const Person = require("./PersonDB");
const Logger = require("./Logger");
const savePersonsToDB = require("./PersonData");
const app = express();

// App Middlewares
app.use(express.json());
app.use(Logger);
app.use(cors());
app.use(express.static(path.join(__dirname, "build")));

// Initially post all persons to DB
savePersonsToDB();

// App Getters
// Get all persons
app.get("/api/persons", (request, response) => {
	Person.find({}).then((result) => {
		result.forEach((person) => {
			console.log(person.name, person.number);
		});
		mongoose.connection.close();
	});
});

// Get person by id
app.get("/api/persons/:id", (request, response) => {
	const id = Number(request.params.id);
	const person = persons.find((person) => person.id === id);

	if (person) {
		response.json(person);
	} else {
		s;
		response.status(404).end();
	}
});

// Sending data to user
app.get("/info", (request, response) => {
	const date = new Date();
	response.send(
		`<p>Phonebook has info for ${persons.length} people</p><p>${date}</p>`
	);
});

// App Deleters
app.delete("/api/persons/:id", (request, response) => {
	const id = Number(request.params.id);
	persons = persons.filter((person) => person.id !== id);
	response.status(204).end();
});

// App Posters
const generateId = () => {
	return (randId = Math.floor(Math.random() * 1000000));
};

app.post("/api/persons", (request, response) => {
	const body = request.body;

	if (!body.name || !body.number) {
		return response.status(400).json({
			error: "name or number missing",
		});
	}

	const person = new Person({
		name: body.name,
		number: body.number,
	});

	person
		.save()
		.then((savedPerson) => {
			response.json(savedPerson);
		})
		.catch((error) => {
			console.log("Error saving person:", error.message);
			response.status(500).end();
		});
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});

// Error Handler Middleware
const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);
