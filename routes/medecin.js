"use strict";

const express = require("express");

const medecinController = require("../controllers/medecinController");

const router = express.Router();

//Consulter les médecins
router.get("/medecins", medecinController.getMedecins);

//Consulter un médecin
router.get("/medecins/:medecinId", medecinController.getMedecin);

//Créer un médecin
router.post("/medecins", medecinController.createMedecin);

//Modifier un médecin
router.put("/medecins/:medecinId", medecinController.updateMedecin);

//Supprimer un médecin
router.delete("/medecins/:medecinId", medecinController.deleteMedecin);

module.exports = router;