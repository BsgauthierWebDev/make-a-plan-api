const path = require('path')
const express = require('express')
const {requireAuth} = require('../middleware/jwt-auth')
const xss = require('xss')
const MaterialsService = require('./materials-service')

const materialsRouter = express.Router()
const jsonParser = express.json()

const serializeMaterials = materials => ({
    ...materials,
    item: xss(materials.item),
    completed: xss(materials.completed),
    project_id: xss(materials.project_id),
})

materialsRouter
    .route('/')
    .all(requireAuth)
    .get((req, res, next) => {
        MaterialsService.getAllMaterials(req.app.get('db'), req.user.id)
            .then(materials => {
                res.json(materials.map(serializeMaterials))
            })
            .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const {
            item,
            completed,
            project_id
        } = req.body

        const newMaterials = {
            item, 
            completed,
            project_id
        }

        // Check for missing fields
        for (const [key, value] of Object.entries(newMaterials)) {
            if (value === null) {
                return res.status(400).json({
                    error: {message: `Missing '${key}' in request body.`}
                })
            }
        }
        MaterialsService.insertMaterials(req.app.get('db'), newMaterials)
            .then(materials => {
                res.status(201)
                    .location(path.posix.join(req.originalUrl, `${materials.id}`))
                    .json(serializeMaterials(materials))
            })
            .catch(next)
    })

materialsRouter
    .route('/:materials_id')
    .all(requireAuth)
    .get((req, res, next) => {
        res.json(serializeMaterials(materials))
    })
    .patch(jsonParser, (req, res, next) => {
        const {
            id,
            completed,
        } = req.body
        const materialsToUpdate = {
            id,
            completed,
        }

        if (!id && !completed) {
            return res.status(400).json({
                error: {message: `Request body must contain 'item', 'completed' and 'project_id`}
            })
        }

        MaterialsService.updateMaterials(
            req.app.get('db'),
            id,
            materialsToUpdate,
        )
            .then(() => {
                res.status(200)
                .json(materialsToUpdate)
            })
            .catch(next)
    })
    .delete((req, res, next) => {
        MaterialsService.deleteMaterials(req.app.get('db'), req.params.materials_id, req.project.id)
            .then(() => {
                res.status(204).end()
            })
            .catch(next)
    })

module.exports = materialsRouter