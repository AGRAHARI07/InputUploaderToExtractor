const express = require('express')
const bodyParser = require('body-parser');
require('dotenv').config()
const initRoutes = require("./routes/web");
const port = 3000;

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function(req, res, next) { //allow cross origin requests
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
    res.header("Access-Control-Max-Age", "3600");
    res.header("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
    next();
});

initRoutes(app);

app.listen(port, () => console.log(`App listening on ${port}!`))