const path = require('path')
const express = require('express')
const {requireAuth} = require('../middleware/jwt-auth')
const xss = require('xss')
const StepsService = require('./steps-service')

const stepsRouter = express.Router()
const jsonParser = express.json()

const serializeSteps = steps => ({
    ...steps,
    step: xss(steps.step),
    completed: xss(steps.completed),
    project_id: xss(steps.project_id)
})

stepsRouter
    .route('/')
    .all(requireAuth)
    .get((req, res, next) => {
        StepsService.getAllSteps(req.app.get('db'), req.user.id)
            .then(steps => {
                res.json(steps.map(serializeSteps))
            })
            .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const {
            step,
            completed,
            project_id
        } = req.body

        const newSteps = {
            step,
            completed,
            project_id
        }

        // Check for missing fields
        for (const [key, value] of Object.entries(newSteps)) {
            if (value === null) {
                return res.status(400).json({
                    error: {message: `Missing '${key}' in request body.`}
                })
            }
        }
        StepsService.insertSteps(req.app.get('db'), newSteps)
            .then(steps => {
                res.status(201)
                    .location(path.posix.join(req.originalUrl, `${steps.id}`))
                    .json(serializeSteps(steps))
            })
            .catch(next)
    })

stepsRouter
    .route('/:steps_id')
    .all((req, res, next) => {
        StepsService.getById(req.app.get('db'), req.params.steps_id, req.project.id)
            .then(steps => {
                if (!steps) {
                    return res.status(400).json({
                        error: {message: `Steps do not exist`}
                    })
                }
                res.steps = steps
                next()
            })
            .catch(next)
    })
    .get((req, res, next) => {
        res.json(serializeSteps(steps))
    })
    .patch(jsonParser, (req, res, next) => {
        const {
            step,
            completed,
            project_id
        } = req.body
        const stepsToUpdate = {
            step,
            completed,
            project_id
        }

        if (!step && !completed && !project_id) {
            return res.status(400).json({
                error: {message: `Request must contain 'step', 'completed' and 'project_id'`}
            })
        }

        StepsService.updateSteps(
            req.app.get('db'),
            req.params.steps_id,
            stepsToUpdate,
            req.project.id
        )
            .then(() => {
                res.status(204).end()
            })
            .catch(next)
    })
    .delete((req, res, next) => {
        StepsService.deleteSteps(req.app.get('db'), req.params.steps_id, req.project.id)
            .then(() => {
                res.status(204).end()
            })
            .catch(next)
    })

module.exports = stepsRouter