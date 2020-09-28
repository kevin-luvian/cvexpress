const express = require('express');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require("body-parser");

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const fileRouter = require('./routes/file');
const userRouter = require('./routes/user');

const allowedOrigins = ['http://localhost:3000', 'http://mycv.atkev.site'];

const app = express();
require("dotenv").config();

app.use(cors({
    origin: function (origin, callback) {
        // deny requests with no origin
        if (!origin) return callback(null, false);
        if (allowedOrigins.indexOf(origin) === -1) {
            var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    }
}));

app.use(
    bodyParser.urlencoded({
        limit: "50mb",
        extended: true,
        parameterLimit: 1000000,
    })
);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/auth', authRouter);
app.use('/api/files', fileRouter);
app.use('/api/users', userRouter);

require("./serverstartup")();

module.exports = app;
