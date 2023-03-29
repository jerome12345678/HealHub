"use strict";

const Patient = require("../models/patient");
const Medecin = require("../models/medecin");
const RendezVous =  require("../models/rendezvous");

const medecins = require("../seeds/medecins");
const patients = require("../seeds/patients");
const rendezVous = require("../seeds/rendezVous");


let result = {};

exports.seed = (req, res, next) =>{

	Medecin.deleteMany()
		.then(() => {
			console.log("Médecins supprimés");
		})
		.then(()=>{

			Medecin.insertMany(medecins)
				.then(medecins =>{

					if(medecins.length > 0){
						result.medecins = medecins;
					}
			

				}).catch(err => {
					if(!err.statusCode){
						err.statusCode = 500;
					}
					next(err);
				});

		})
		.catch(err => {
			if(!err.statusCode){
				err.statusCode = 500;
			}
			next(err);
		});
 
	Patient.deleteMany()
		.then(() => {
			console.log("Patients supprimés");
		})
		.then(()=>{
			Patient.insertMany(patients)
				.then(patients =>{

					if(patients.length > 0){
						result.patients = patients;
						
					}
			

				}).catch(err => {
					if(!err.statusCode){
						err.statusCode = 500;
					}
					next(err);
				});
		})
		.catch(err => {
			if(!err.statusCode){
				err.statusCode = 500;
			}
			next(err);
		});

	RendezVous.deleteMany()
		.then(() => {
			console.log("Rendez-vous supprimés");
		})
		.then(()=>{
			RendezVous.insertMany(rendezVous)
				.then(rendezVous =>{

					if(rendezVous.length > 0){
						result.rendezVous = rendezVous;
					
					}
			

				}).catch(err => {
					if(!err.statusCode){
						err.statusCode = 500;
					}
					next(err);
				});
		})
		.catch(err => {
			if(!err.statusCode){
				err.statusCode = 500;
			}
			next(err);
		});	

	res.status(200).json(result);
	
};