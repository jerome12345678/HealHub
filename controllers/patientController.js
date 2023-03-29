"use strict";

const Patient = require("../models/patient");

/**
 * Get tout les patients
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.getPatients = (req, res, next) => {
	Patient.find()
		.then(Patients => {
			res.status(200).json(Patients);
		})
		.catch(err => {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		});
};

/**
 * Get un patient par son id
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.getPatient = (req, res, next) => {
	const patientId = req.params.patientId;
	Patient.findById(patientId)
		.then(patient =>{
			if(!patient){
				const err = new Error("Patient inexistant")
				err.statusCode = 404
				throw err
			}
			else{
				res.status(200).json(patient)
			}
		})
		.catch(err =>{
			next(err)
		});
}

/**
 * Crée un patient en lui initialisant un répertoire d'historique vide
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.createPatient = (req, res, next) => {
	const nom = req.body.nom;
	const prenom = req.body.prenom;
	const dateNaissance = req.body.dateNaissance;
	const telephone = req.body.telephone;
	const courriel = req.body.courriel;
	const adresse = req.body.adresse;
	const codePostal = req.body.codePostal;
	let historique = []
	if (req.body.historique && Array.isArray(req.body.historique)){
		historique = req.body.historique.map(h => {
			return{
				information: h.information,
				medecinId: h.medecinId,
				creationDate: h.creationDate
			}
		})
	}

	const patient = new Patient({
		nom: nom,
		prenom: prenom,
		dateNaissance: dateNaissance,
		telephone: telephone,
		courriel: courriel,
		adresse: adresse,
		codePostal: codePostal,
		historique: historique
	});

	patient
		.save()
		.then(patient => {
			res.location("/patients/" + patient._id);
			res.status(201).json(patient);
		})
		.catch(err => {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		});
}

/**
 * Update un patient
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.updatePatient = (req, res, next) => {
	const patientId = req.params.patientId;
	const nom = req.body.nom;
	const prenom = req.body.prenom;
	const dateNaissance = req.body.dateNaissance;
	const telephone = req.body.telephone;
	const courriel = req.body.courriel;
	const adresse = req.body.adresse;
	const codePostal = req.body.codePostal;

	Patient.findById(patientId)
		.then(patient =>{
			if(!patient){
				const err = new Error("Patient inexistant")
				err.statusCode = 404
				throw err
			}
			else{
				patient.nom = nom;
				patient.prenom = prenom;
				patient.dateNaissance = dateNaissance;
				patient.telephone = telephone;
				patient.courriel = courriel;
				patient.adresse = adresse;
				patient.codePostal = codePostal;
				patient.save();
				res.status(200).json(patient)
			}
		})
		.catch(err =>{
			next(err)
		})
}

/**
 * Ajoute un historique au répertoire d'un patient
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.createHistorique = (req, res, next) => {
	const patientId = req.params.patientId;
	const medecinId = req.body.medecinId;
	const information = req.body.information;
	const created_at = req.body.created_at;

	Patient.findById(patientId)
		.then(patient =>{
			if(!patient){
				const err = new Error("Patient inexistant")
				err.statusCode = 404
				throw err
			}
			else{
				const object = {
					medecinId: medecinId,
					information: information,
					created_at: created_at
				}
				patient.historique.push(object)
				patient.save();
				res.location("/patients/" + patient._id);
				res.status(201).json(patient)
			}
		})
		.catch(err =>{
			next(err)
		});
	
}

/**
 * supprime un historique du répertoire d'un patient
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.deleteHistorique = (req, res, next) => {
	const patientId = req.params.patientId;
	const historiqueId = req.params.historiqueId;

	Patient.findById(patientId)
		.then(patient =>{
			if(!patient){
				const err = new Error("Patient inexistant")
				err.statusCode = 404
				throw err
			}
			else{
				patient.historique.pull(historiqueId)
				patient.save();
				res.status(204).send()
			}
			
		})
		.catch(err =>{
			next(err)
		});
		
}

/**
 * supprime un patient
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.deletePatient = (req, res, next) => {
	const patientId = req.params.patientId;
	Patient.findByIdAndRemove(patientId)
		.then(() =>{
			res.status(204).send()
		})
}




