const express = require('express');
const app = express();
const morgan = require('morgan');
const ExpressError = require('./expressError');
const itemsRoutes = require("./routes/items");

app.use(express.json());
app.use(morgan('dev'));
app.use('/items', itemsRoutes);


// 404 Handler 
app.use((req, res) => {
    return new ExpressError("Not Found", 404)
});

// generic error handler 

app.use((err, req, res, next) => {
    // the default status is 500 Internal Server Error 
    let status = err.status || 500;

    // set the status and alert the user 
    return res.status(status).json({
        error: {
            message: err.message,
            status: status
        }
    });
});

module.exports = app;