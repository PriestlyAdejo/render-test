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

// Error Handler
const errorHandler = (error, request, response, next) => {
	console.error(error.message);

	if (error.name === "CastError") {
		return response.status(400).send({ error: "malformatted id" });
	} else if (error.name === "ValidationError") {
		return response.status(400).json({ error: error.message });
	}

	next(error);
};

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
app.get("/api/persons/:id", (request, response, next) => {
	Person.findById(request.params.id)
		.then((person) => {
			if (person) {
				response.json(person);
			} else {
				response.status(404).end();
			}
		})
		.catch((error) => next(error));
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
	Person.findByIdAndRemove(request.params.id)
		.then((result) => {
			response.status(204).end();
		})
		.catch((error) => next(error));
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
		.catch((error) => next(error));
});

// App Putters
app.put("/api/persons/:id", (request, response, next) => {
	const { name, number } = request.body;

	const person = {
		name: body.name,
		number: body.number,
	};

	Person.findByIdAndUpdate(
		request.params.id,
		{ name, number },
		{ new: true, runValidators: true, context: "query" }
	)
		.then((updatedPerson) => {
			response.json(updatedPerson);
		})
		.catch((error) => next(error));
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
app.use(errorHandler);
