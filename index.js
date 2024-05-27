require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { CONSTANTS } = require('./utils/constants');

const UsersRoute = require('./routes/users');

const app = express();
app.use(express.json());
app.use(cors());

app.use('/public', express.static('public'));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if(req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

app.use('/users', UsersRoute);

app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error:{
            message: error.message
        }
    });
});

app.listen(CONSTANTS.PORT, () => {
    console.log(`running on port ${CONSTANTS.PORT}`);
});