"use strict";

const medecin = require("../models/medecin");
const Medecin = require("../models/medecin");

/**
 * Get tout les médecins par spécialité ou tout les médecins si aucune spécialité n'est spécifiée
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.getMedecins = (req, res, next) => {
	
	const specialite = req.query.specialite

	if (specialite){
		Medecin.find({specialite: specialite})
			.then(medecins => {
				res.status(200).json(medecins);
			})
			.catch(err => {
				if (!err.statusCode) {
					err.statusCode = 500;
				}
				next(err);
			});
	}
	else{
		Medecin.find()
			.then(medecins => {
				res.status(200).json(medecins);
			})
			.catch(err => {
				if (!err.statusCode) {
					err.statusCode = 500;
				}
				next(err);
			});
	}
};

/**
 * Get un médecin par son id
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.getMedecin = (req, res, next) => {
	const medecinId = req.params.medecinId
	Medecin.findById(medecinId)
		.then(medecin =>{
			if(!medecin){
				const err = new Error("Médecin inexistant")
				err.statusCode = 404
				throw err
				
			}
			else{
				res.status(200).json(medecin)
			}
		})
		.catch(err =>{
			next(err)
		});
}

/**
 * Crée un nouveau médecin
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.createMedecin = (req, res, next) => {

	const nom = req.body.nom
	const prenom = req.body.prenom
	const telephone = req.body.telephone
	const courriel = req.body.courriel
	const specialite = req.body.specialite

	const medecin = new Medecin({
		nom: nom,
		prenom: prenom,
		telephone: telephone,
		courriel: courriel,
		specialite: specialite
	});

	medecin.save()
		.then( () => {
			res.location("/medecins/" + medecin.id)
			res.status(201).json(medecin)
		})
		.catch(err => {
			next(err)
		});
};

/**
 * Update les informations d'un médecin
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.updateMedecin = (req, res, next) => {

	const medecinId = req.params.medecinId;
	const nouvNom = req.body.nom
	const nouvPrenom = req.body.prenom
	const nouvTelephone = req.body.telephone
	const nouvCourriel = req.body.courriel
	const nouvSpecialite = req.body.specialite
	
	
	Medecin.findById(medecinId)
		.then(medecin => {
			if(!medecin){
				const err = new Error("Medecin inexistant")
				err.statusCode = 404
				throw err
			}
			else{
				medecin.nom = nouvNom
				medecin.prenom = nouvPrenom
				medecin.telephone = nouvTelephone
				medecin.courriel = nouvCourriel
				medecin.specialite = nouvSpecialite
				medecin.save();
				res.status(200).json(medecin)
			}
		
		})
		.catch(err => {
			next(err)
		});
};

/**
 * Delete un médecin
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.deleteMedecin = (req, res, next) => {
	const medecinId = req.params.medecinId;
	Medecin.findByIdAndRemove(medecinId)
		.then(() => {
			res.status(204).send()
		});
};






