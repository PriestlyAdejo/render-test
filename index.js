const express = require("express");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const app = express();

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

// App Middlewares
app.use(express.json());
app.use(logger);
app.use(cors());
app.use(express.static(path.join(__dirname, "build")));

// App Getters
// Get all persons
app.get("/api/persons", (request, response) => {
	response.json(persons);
});

// Get person by id
app.get("/api/persons/:id", (request, response) => {
	const id = Number(request.params.id);
	const note = persons.find((person) => person.id === id);

	if (note) {
		response.json(note);
	} else {
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

	if (persons.find((person) => person.name === body.name)) {
		return response.status(400).json({ error: "name must be unique" });
	}

	const person = {
		id: generateId(),
		name: body.name,
		number: body.number,
	};

	persons = persons.concat(person);

	response.json(person);
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
