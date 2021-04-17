module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    DATABASE_URL: process.env.DATABASE_URL || 'https://pacific-hamlet-55041.herokuapp.com/',
    TEST_DATABASE_URL: 'postgresql://dunder_mifflin@localhost/make-a-plan-test',
    JWT_SECRET: process.env.JWT_SECRET || 'change-this-secret',
    JWT_EXPIRY: process.env.JWT_EXPIRY || '24h'
}