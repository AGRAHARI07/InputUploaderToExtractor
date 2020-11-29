const express = require("express");
const router = express.Router();
const bodyParser = require('body-parser');
const path = require('path');
const homeController = require("../controllers/home");
const uploadController = require("../controllers/upload");
const readline = require('../controllers/first-line');
const putInput = require('../controllers/putInputToExtractor');
const putLatestCrawlData = require('../controllers/putLatestCrawlData');

let routes = app => {
    router.get("/", homeController.getHome);
    router.get('/js/script.js', function sendScripJS(req, res) {
        res.sendFile(path.join(__dirname + '/../public/js/script.js'));
    });

    // sends first line of the csv file, i.e headers of csv file
    router.get("/first-line", readline.getFirstLine);

    // process the uploaded files by user 
    router.post('/multiple-upload', uploadController.multipleUpload);

    // sends js file
    router.get('/js/postData.js', function sendPostDataJS(req, res) {
        res.sendFile(path.join(__dirname + '/../public/js/postData.js'));
    })

    // posts csv parsed file to extractor
    router.use(bodyParser.json());
    router.post("/api/postDataToExtractor", putInput.putInputToExtractor);

    // fetchs latest crawl csv file and converts to json from given extractor id
    router.use(bodyParser.json());
    router.post("/postlatestcrawlrun", putLatestCrawlData.putLatestCrawlData)

    return app.use("/", router);
};

module.exports = routes;