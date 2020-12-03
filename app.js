const express = require('express');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require("body-parser");

const catchallRouter = require('./routes/catchall');
const authRouter = require('./routes/auth');
const fileRouter = require('./routes/file');
const userRouter = require('./routes/user');
const myinfoRouter = require('./routes/myinfo');
const descriptionRouter = require('./routes/description');
const quickinfoRouter = require('./routes/quickinfo');
const skillRouter = require('./routes/skill');
const resumeRouter = require('./routes/resume');
const messageRouter = require('./routes/message');
const directoryRouter = require('./routes/directory');

const allowedOrigins = [process.env.CORS_URL + '', 'https://mycv.atkev.site', 'http://localhost:3000'];

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
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/auth', authRouter);
app.use('/api/files', fileRouter);
app.use('/api/users', userRouter);
app.use('/api/myinfo', myinfoRouter);
app.use('/api/description', descriptionRouter);
app.use('/api/quickinfos', quickinfoRouter);
app.use('/api/resumes', resumeRouter);
app.use('/api/skills', skillRouter);
app.use('/api/messages', messageRouter);
app.use('/api/directories', directoryRouter);
app.use('/api/*', catchallRouter);

app.use(express.static(path.join(__dirname, "frontend/build")));
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname + "/frontend/build/index.html"));
});

require("./serverstartup")();

module.exports = app;
