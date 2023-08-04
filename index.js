const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 5500;

// Creates and connects to the SQLite database
const db = new sqlite3.Database("./database.db", (err) => {
	if (err) {
		console.error(err.message);
	}
	console.log("Connected to the database.");
});

// Creates projects table if it doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS projects (
  id INTEGER PRIMARY KEY,
  title TEXT,
  description TEXT,
  skills TEXT,
  links TEXT
)`);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Routes
app.get("/api/projects", (req, res) => {
	db.all("SELECT * FROM projects", (err, rows) => {
		if (err) {
			console.error(err.message);
			res.status(500).json({ error: "Internal server error" });
			return;
		}
		res.json(rows);
	});
});

app.post("/api/projects", (req, res) => {
	const { title, description, skills, links } = req.body;
	db.run(
		"INSERT INTO projects (title, description, skills, links) VALUES (?, ?, ?, ?)",
		[title, description, skills, links],
		(err) => {
			if (err) {
				console.error(err.message);
				res.status(500).json({ error: "Internal server error" });
				return;
			}
			res.json({ message: "Project added successfully" });
		}
	);
});

// Start the server
app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
