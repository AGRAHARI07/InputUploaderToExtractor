const path = require('path');
const importHelper = require('../importIO/csv-file-fetch');
const { convertCsvFiles, _deleteFiles, _handleError, _writeResponse } = require('../controllers/upload');
const { rejects } = require('assert');


async function getCrawlCsv(extractorId, pathToWrite) {
    if (!extractorId) throw Error(`extractor id not found: ${extractorId}`);
    if (!pathToWrite) throw Error(`path to save csv file not passed: ${pathToWrite}`);

    new Promise((r, j) => {
        console.log(`fetching crawl run data, extractor: ${extractorId}, pathTowrite: ${pathToWrite}`);
        importHelper.fetchCsvFile(extractorId, pathToWrite)
            .then(re => r(re))
            .catch(rj => j(rj));
    })
}

const putLatestCrawlDataToExtractor = async function(req, res) {
    const csvToWrite = path.join(`${__dirname}/../public/files/uploadedFile/input_1.csv`);
    const csvFileFolderPath = path.join(`${__dirname}/../public/files/uploadedFile`);
    const jsonFileFolderPath = path.join(`${__dirname}/../public/files/convertedFile`);

    // deleting files that were already present if any
    let paths = [csvFileFolderPath, jsonFileFolderPath];
    _deleteFiles(paths);

    let body = req.body;
    let extractorId = body.extractorId;

    getCrawlCsv(extractorId, csvToWrite)
        .then(res => {
            console.log('File downloaded from crawl run with extractor id: ' + extractorId);
            convertCsvFiles('input_1.csv', csvFileFolderPath, jsonFileFolderPath)
                .then(value => {
                    console.log('File converted from csv to json....writing response');
                    _writeResponse(req, res, value)
                })
        })
        .catch(err => {
            console.log(err);
            _handleError(req, res, err)
        });
}

module.exports = {
    putLatestCrawlData: putLatestCrawlDataToExtractor
};