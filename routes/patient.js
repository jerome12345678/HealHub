"use strict";

const express = require("express");

const patientController = require("../controllers/patientController");

const router = express.Router();

router.get("/patients", patientController.getPatients);

router.get("/patients/:patientId", patientController.getPatient);

router.post("/patients", patientController.createPatient);

router.put("/patients/:patientId", patientController.updatePatient);

router.post("/patients/:patientId/historique", patientController.createHistorique);

router.delete("/patients/:patientId/historique/:historiqueId", patientController.deleteHistorique);

router.delete("/patients/:patientId", patientController.deletePatient);



module.exports = router;