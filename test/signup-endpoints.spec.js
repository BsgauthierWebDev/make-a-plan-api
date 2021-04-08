const knex = require('knex');
const bcrypt = require('bcryptjs');
const app = require('../src/app');
const helpers = require('./test-helpers');
const supertest = require('supertest');
const { expect } = require('chai');

describe(`Sign Up Endpoints`, function() {
    let db

    const {testUsers} = helpers.makeProjectFixtures()
    const testUser = testUSers[0]

    before(`make knex instance`, () => {
        db = knex({
            client: 'pg',
            connection: process.env.DATABASE_URL,
        })
        app.set('db', db)
    })

    after(`disconnect from db`, () => db.destroy())

    before('cleanup', () => helpers.cleanTables(db))

    afterEach('cleanup', () => helpers.cleanTables(db))

    describe(`POST /api.auth/sign-up`, () => {
        context(`User Validation`, () => {
            beforeEach(`insert users`, () =>
                helpers.seedUsers(
                    db,
                    testUsers,
                )
            )

            const requiredFields = ['email', 'username', 'password']

            requiredFields.forEach(field => {
                const registerAttemptBody = {
                    email: 'test email',
                    username: 'test username',
                    password: 'test password'
                }

                it(`responds with 400 required error when '${field}' is missing`, () => {
                    delete registerAttemptBody[field]

                    return supertest(app)
                        .post(`/api/auth/sign-up`)
                        .send(registerAttemptBody)
                        .expect(400, {
                            error: `Missing '${field}' in request body`
                        })
                })
            })
            it(`responds 400 'Password must be longer than 8 characters' when empty password`, () => {
                const userShortPassword = {
                    email: 'test email',
                    username: 'test username',
                    password: '1234567'
                }
                return supertest(app)
                    .post(`/api.auth/sign-up`)
                    .send(userShortPassword)
                    .expect(400, {error: `Password must be longer than 8 characters`})
            })

            it(`responds 400 'Password must be less than 32 chacacters' when long password`, () => {
                const userLongPassword = {
                    email: 'test email',
                    username: 'test username',
                    password: '*'.repeat(75)
                }
                return supertest(app)
                    .post(`/api/auth/sign-up`)
                    .send(userLongPassword)
                    .expect(400, {error: `Password must be less than 32 characters`})
            })

            it(`responds 400 error when password starts with spaces`, () => {
                const userPasswordStartsSpaces = {
                    email: 'test email',
                    username: 'test username',
                    password: ' Password1'
                }
                return supertest(app)
                    .post(`/api/auth/sign-up`)
                    .send(userPasswordStartsSpaces)
                    .expect(400, {error: `Password must not start or end with empty spaces`})
            })

            it(`responds 400 error when password ends with spaces`, () => {
                const userPasswordEndsSpaces = {
                    email: 'test email',
                    username: 'test username',
                    password: 'Password1 '
                }
                return supertest(app)
                    .post(`/api.auth/sign-up`)
                    .send(userPasswordEndsSpaces)
                    .expect(400, {error: `Password must not start or end with empty spaces`})
            })


            it(`responds 400 'Username already taken' when username isn't unique`, () => {
                const duplicateUser = {
                    email: 'test email',
                    username: testUser.username,
                    password: 'test password'
                }
                return supertest(app)
                    .post(`/api/auth/sign-up`)
                    .send(duplicateUser)
                    .expect(400, {error: `Username already taken`})
            })
        })

        context(`Happy path`, () => {
            it(`responds 201, serialized user, storing bcrypted password`, () => {
                const newUser = {
                    email: 'test@email.com',
                    username: 'test-username',
                    password: 'Password1'
                }
                return supertest(app)
                    .post(`/api/auth/sign-up`)
                    .send(newUser)
                    .expect(201)
                    .expect(res => {
                        expect(res.body).to.have.property('id')
                        expect(res.body.email).to.eql(newUser.email)
                        expect(res.body.username).to.eql(newUser.username)
                        expect(res.body).to.not.have.property('password')
                        expect(res.headers.location).to.eql(`/api/auth/sign-up/${res.body.id}`)
                        const expectedDate = new Date().toLocaleString('en', {timeZone: 'UTC'})
                        const actualDate = new Date(res.body.date_created).toLocaleString()
                        expect(actualDate).to.eql(expectedDate)
                    })
                    .expect(res =>
                        db
                            .from('make-a-plan')
                            .select('*')
                            .where({id: res.body.id})
                            .first()
                            .then(row => {
                                expect(row.email).to.eql(newUser.email)
                                expect(row.username).to.eql(newUser.username)
                                const expectedDate = new Date().toLocaleString('en', {timeZone: 'UTC'})
                                const actualDate = new Date(row.date_created).toLocaleString()
                                expect(actualDate).to.eql(expectedDate)

                                return bcrypt.compare(newUser.password, row.password)
                            })
                            .then(compareMatch => {
                                expect(compareMatch).to.be.true
                            })
                        )
            })
        })
    })
})