require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const {NODE_ENV} = require('./config')
const signUpRouter = require('./signUp/signUp-router')
const logInRouter = require('./logIn/logIn-router')
const projectRouter = require('./projects/project-router')
const materialsRouter = require('./materials/materials-router')
const stepsRouter = require('./steps/steps-router')

const app = express()

const morganOption = (NODE_ENV === 'production')
    ? 'tiny'
    : 'common';

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors());
app.get('/', (req, res) => {
    res.send('Hello, world!')
})

app.use('/api/auth', signUpRouter)
app.use('/api/auth', logInRouter)
app.use('/api/projects', projectRouter)
app.use('/api/materials', materialsRouter)
app.use('/api/steps', stepsRouter)


app.use(function errorHandler(error, req, res, next) {
    let response
    if (NODE_ENV === 'production') {
        response = {error: {message: 'server error'}}
    } else {
        console.error(error)
        response = {message: error.message, error}
    }
    res.status(500).json(response)
})

module.exports = app