const path = require('path')
const express = require('express')
const xss = require('xss')
const ProjectService = require('./project-service')

const projectRouter = express.Router()
const jsonParser = express.json()

const serializeProject = project => ({
    ...project,
    name: xss(project.name),
    description: xss(project.description),
    materials: xss(project.materials),
    steps: xss(project.steps)
})

projectRouter
    .route('/')
    .get((req, res, next) => {
        ProjectService.getAllProjects(req.app.get('db'), req.body.user_id)
            .then(projects => {
                res.json(projects.map(serializeProject))
            })
            .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const {
            name,
            description,
            materials,
            steps,
            user_id
        } = req.body

        const newProject = {
            name,
            description,
            materials,
            steps,
            user_id
        }

        //check for missing fields
        for (const [key, value] of Object.entries(newProject)) {
            if (value == null) {
                return res.status(400).json({
                    error: {message: `Missing '${key}' in request body`}
                })
            }
        }
        if (!newProject.description) {
            newProject.description = null
        }
        ProjectService.insertProject(req.app.get('db'), newProject)
            .then(project => {
                res.status(201)
                    .location(path.posix.join(req.originalUrl, `${project.id}`))
                    .json(serializeProject(project))
            })
            .catch(next)
    })

projectRouter
    .route('/:project_id')
    .all((req, res, next) => {
        ProjectService.getById(req.app.get('db'), req.params.project_id, req.body.user_id)
            .then(project => {
                if (!project) {
                    return res.status(404).json({
                        error: {message: `Project doesn't exist`}
                    })
                }
                res.project = project //save the Project for the next middleware
                next() //don't forget to call next so the next middleware happens
            })
            .catch(next)
    })
    .get((req, res, next) => {
        res.json(serializeProject(res.project))
    })
    .patch(jsonParser, (req, res, next) => {
        const {
            name, 
            description,
            materials,
            steps,
            user_id
        } = req.body
        const projectToUpdate = {
            name, 
            description,
            materials,
            steps,
            user_id
        }

        if (!name && !materials && !steps && !user_id) {
            return res.status(400).json({
                error: {
                    message: `Request body must contain 'name', 'materials', 'steps' or 'user_id' field`
                }
            })
        }

        ProjectService.updateProject(
            req.app.get('db'),
            req.params.project_id,
            projectToUpdate,
            req.body.user_id
        )
            .then(() => {
                res.status(204).end()
            })
            .catch(next)
    })
    .delete((req, res, next) => {
        ProjectService.deleteProject(req.app.get('db'), req.params.project_id, req.body.user_id)
            .then(() => {
                res.status(204).end()
            })
            .catch(next)
    })

module.exports = projectRouter