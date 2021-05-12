const path = require('path')
const express = require('express')
const {requireAuth} = require('../middleware/jwt-auth')
const xss = require('xss')
const ProjectService = require('./project-service')
const MaterialsService = require('../materials/materials-service')
const StepsService = require('../steps/steps-service')

const projectRouter = express.Router()
const jsonParser = express.json()

const serializeProject = project => ({
    ...project,
    name: xss(project.name),
    description: xss(project.description),
    materials: xss(project.materials),
    steps: xss(project.steps),
})

projectRouter
    .route('/')
    .all(requireAuth)
    .get((req, res, next) => {
        ProjectService.getAllProjects(req.app.get('db'), req.user.id)
            .then(projects => {
                console.log(projects)
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
        } = req.body

        const newProject = {
            name,
            description,
            materials,
            steps,
        }

        newProject.user_id = req.user.id

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
            //.then(function(project) { ......; return project }).then
            .then(function(project) {
                // res
                return project;
                })
            .then(function(project) {//build out new materials to add
                MaterialsService.insertMaterials(req.app.get('db'), project.materials)
                .then(function(notProject) {
                    // res
                    //     .location(path.posix.join(req.originalUrl, `${materials.id}`))
                    //     .json(serializeMaterials(materials))
                return newProject;
            })
            })
            .then(function(project) {//build out new steps to add
                console.log(project);
                StepsService.insertSteps(req.app.get('db'), newProject.steps)
                .then(function(project) {
                    res.status(201)
                    .location(path.posix.join(req.originalUrl, `${project.id}`))
                    .json(serializeProject(project))
                })
            })
            .catch(next)
    })

projectRouter
    .route('/:project_id')
    .all(requireAuth)
    .all((req, res, next) => {
        ProjectService.getById(req.app.get('db'), req.params.project_id, req.user.id)
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
        } = req.body
        const projectToUpdate = {
            name, 
            description,
            materials,
            steps,
        }

        if (!name && !materials && !steps) {
            return res.status(400).json({
                error: {
                    message: `Request body must contain 'name', 'materials', or 'steps' field`
                }
            })
        }

        ProjectService.updateProject(
            req.app.get('db'),
            req.params.project_id,
            projectToUpdate,
            req.user.id
        )
            .then(() => {
                res.status(204).end()
            })
            .catch(next)
    })
    .delete((req, res, next) => {
        console.log(req.user)
        ProjectService.deleteProject(req.app.get('db'), req.params.project_id, req.user.id)
            .then(() => {
                res.status(204).end()
            })
            .catch(next)
    })

module.exports = projectRouter