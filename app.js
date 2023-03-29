"user strict";

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const medecinRoutes = require("./routes/medecin");
const patientRoutes = require("./routes/patient");
const rendezvousRoutes = require("./routes/rendezvous");

const seed = require("./routes/db");

const app = express();

const port = 3000;

app.use(bodyParser.json());


app.use((req, res, next) =>{
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Methodes", "OPTIONS, GET, POST, PUT, PATCH, DELETE");
	res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
	next();

});


app.use(medecinRoutes);
app.use(patientRoutes);
app.use(rendezvousRoutes);

app.use(seed);

app.use((error, req, res, next) => {
	
	const status = error.statusCode || 500;
	const message = error.message;
	const data = error.data;
	res.status(status).json({ message: message, data: data });
});

mongoose
	.connect("mongodb://127.0.0.1:27017/HealHub")
	.then(() => {
		app.listen(port);
		console.log("Serveur à l'écoute sur : http://localhost" + port);
	});

