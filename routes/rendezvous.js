"use strict";

const express = require("express");

const rendezvousController = require("../controllers/rendezvousController");

const router = express.Router();

router.post("/rendezvous", rendezvousController.createRendezvous);

router.get("/rendezvous/:rendezvousId", rendezvousController.getRendezvous);

router.get("/rendezvous/medecins/:medecinId", rendezvousController.getRendezvousMedecin);

router.get("/rendezvous/patients/:patientId", rendezvousController.getRendezvousPatient);

router.delete("/rendezvous/:rendezvousId", rendezvousController.deleteRendezvous);

module.exports = router;