"use strict"

const Rendezvous = require("../models/rendezvous")

/**
 * Crée un rendez-vous en s'assurant que la plage horaire n'est pas déjà prise
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.createRendezvous = (req, res, next) => {
    const patientId = req.body.patientId
    const medecinId = req.body.medecinId
    const debut = new Date(req.body.debut)

    const date = new Date(debut)
    date.setMinutes(date.getMinutes() + 30)

    const fin = date
    const notes = req.body.notes
    
    Rendezvous.find({ $or: [{debut: { $gte: new Date(debut), $lt: new Date(fin)} }, 
                    {fin: { $lte: new Date(fin), $gt: new Date(debut)} }] })
        .then(rendezvous => {
            if (rendezvous.length != 0) {
                const error = new Error("Plage horaire déjà pris")
                error.statusCode = 400
                throw error
            }
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500
            }
            next(err)
        })


    const rendezvous = new Rendezvous({
        
        patientId: patientId,
        medecinId: medecinId,
        debut: debut,
        fin: fin,
        notes: notes
    })

    rendezvous.save()
        .then( () => {
            res.location("/rendezvous/" + rendezvous.id)
            res.status(201).json(rendezvous)
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500
            }
            next(err)
        })
}

/**
 * Get un rendez-vous par son id
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.getRendezvous = (req, res, next) => {
    const rendezvousId = req.params.rendezvousId
    Rendezvous.findById(rendezvousId)
        .then(rendezvous => {
            if (!rendezvous) {
                const error = new Error("Rendez-vous non trouvé")
                error.statusCode = 404
                throw error
            }
            res.status(200).json(rendezvous)
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500
            }
            next(err)
        })
}

/**
 * Get les rendez-vous d'un médecin et permet un filtre par date
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.getRendezvousMedecin = (req, res, next) => {
    const medecinId = req.params.medecinId
    const date = req.query.date

    const a = new Date(date)

    if (date) {
        Rendezvous.find({ $and: [{medecinId: medecinId}, {debut: { $gte: new Date(a), $lt: new Date(a.setDate(a.getDate() + 1))}}] })
            .then(rendezvous => {
                if (!rendezvous) {
                    const error = new Error("aucun rendez-vous trouvé")
                    error.statusCode = 404
                    throw error
                }
                res.status(200).json(rendezvous)
            })
            .catch(err => {
                if (!err.statusCode) {
                    err.statusCode = 500
                }
                next(err)
            })
    }
    else{
        Rendezvous.find({medecinId: medecinId})
        .then(rendezvous => {
            if (rendezvous.length === 0) {
                const error = new Error("aucun rendez-vous trouvé")
                error.statusCode = 404
                throw error
            }
            res.status(200).json(rendezvous)
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500
            }
            next(err)
        })
    }
}

/**
 * Get les rendez-vous d'un patient et permet un filtre par date
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.getRendezvousPatient = (req, res, next) => {
    const patientId = req.params.patientId
    const date = req.query.date

    const a = new Date(date)

    if (date) {
        Rendezvous.find({ $and: [{patientId: patientId}, {debut: { $gte: new Date(a), $lt: new Date(a.setDate(a.getDate() + 1))}}] })
            .then(rendezvous => {
                if (!rendezvous) {
                    const error = new Error("aucun rendez-vous trouvé")
                    error.statusCode = 404
                    throw error
                }
                res.status(200).json(rendezvous)
            })
            .catch(err => {
                if (!err.statusCode) {
                    err.statusCode = 500
                }
                next(err)
            })
    }
    else{
        Rendezvous.find({patientId: patientId})
            .then(rendezvous => {
                if(rendezvous.length === 0) {
                    const error = new Error("aucun rendez-vous trouvé")
                    error.statusCode = 404
                    throw error
                }
                res.status(200).json(rendezvous)
            })
            .catch(err => {
                if (!err.statusCode) {
                    err.statusCode = 500
                }
                next(err)
            })
    }

    
}

/**
 * Delete un rendez-vous par son id
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.deleteRendezvous = (req, res, next) => {
    const rendezvousId = req.params.rendezvousId
    Rendezvous.findByIdAndDelete(rendezvousId)
        .then(result => {
            res.status(204).json({
                message: "Rendez-vous supprimé"
            })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500
            }
            next(err)
        })
}