const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const session = require('express-session');

const knexSessionStore = require('connect-session-knex')(session);
const restricted = require('../auth/restricted-middleware.js');

// express routers
const usersRouter = require('../users/users-router.js');
const authRouter = require('../auth/auth-router.js');

// server object
const server = express();

const sessionConfig = {
    name: 'trolli',
    secret: 'a flock of crows is known as a murder.',
    cookie: {
        maxAge: 3600 * 1000,
        secure: false,
    },
    httpOnly: true,
    resave: false,
    saveUninitialized: false,
    store: new knexSessionStore(
        {
            knex: require('../database/dbConfig.js'),
            tablename: 'sessions', // table that stores sessions inside of DB
            sidfieldname: 'sid', // column that holds session id
            createtable: true,
            clearInterval: 3600 * 1000
        }
    )
}

// global middleware
server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionConfig));

server.use('/api/users', restricted, usersRouter);
server.use('/api/auth', authRouter);

server.get("/", (req, res, next) => {
    res.json({
        message: "This is the API",
    })
})

module.exports = server; 