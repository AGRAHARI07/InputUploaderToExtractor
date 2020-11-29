const csv = require('csvtojson');
const fs = require('fs');
const config = require('../configurations.json');
const HorizontalLineDash = '-----------------------------------------------------------------------------------------------------------------';

/**
 * 
 * @param {string} csvFileName accept filename with .csv extension 
 * @param {string} csvFileFolderPath accept path of the folder 
 * @param {string} jsonFileFolderPath 
 * @param {Function} callback accepts a function that can be executed upon completion of csv file to json conversion
 */
const helperCsvToJSON = (csvFileName, csvFileFolderPath, jsonFileFolderPath, callback) => {

    return new Promise((res, rej) => {
        let csvFilePath;
        let fileNameSplittedArr;
        let jsonFilePath;
        let fileCounterDotCsv;
        let fileNameCounter;
        try {
            csvFilePath = `${csvFileFolderPath}/${csvFileName}`;
            console.log('TESTING: csvFilePath ' + csvFilePath);
            // splitting to get counter of the file Ex: input_1, input_2 etc from the uploaded files
            fileNameSplittedArr = csvFileName.split('_');
            console.log('TESTING: fileNameSplittedArr:');
            console.log(fileNameSplittedArr);

            fileCounterDotCsv = fileNameSplittedArr[fileNameSplittedArr.length - 1].split('.');
            console.log("fileCounterDotCsv: " + fileCounterDotCsv);

            fileNameCounter = fileCounterDotCsv[fileCounterDotCsv.length - 2];
            console.log('fileNameCounter: ' + fileNameCounter);

            jsonFilePath = `${jsonFileFolderPath}/${config.fileNameUploadedFromServerInJson}_${fileNameCounter}.json`;
            console.log('TESTING: jsonFilePath ' + jsonFilePath);
        } catch (error) {
            rej(error);
        }

        console.log(HorizontalLineDash);
        console.log('Reading file with following info:');
        console.log({
            csvFileName: csvFileName,
            csvFileFolderPath: csvFileFolderPath,
            csvFilePath: csvFilePath,
            jsonFileFolderPath: jsonFileFolderPath,
            jsonFilePath: jsonFilePath
        });
        console.log(`${HorizontalLineDash}\n\n`);

        const readStream = fs.createReadStream(csvFilePath);
        const writeStream = fs.createWriteStream(jsonFilePath);

        let response = readStream.pipe(csv()).pipe(writeStream)
        response.on('finish', () => {
            if (callback && typeof(callback) === 'function') {
                callback();
            } else {
                console.log("callback is not a function");
                rej('callback is expected to be a function');
            }
            res('Success');
        });
        response.on('error', (err) => {
            console.log(`CSV to JSON conversion failed, error: ${err}`);
            rej(`CSV to JSON conversion failed: FILE: ${csvFileName}`);
        })
    })
}

function checkArguments(argumentsList) {
    let length = Object.values(argumentsList).filter(Boolean).length;
    return argumentsList.length === length ? true : false
}


/**
 * 
 * @param {string} csvFileFolderPath csv folder path to read
 * @param {string} jsonFileFolderPath JSON folder path 
 * @param {*} filename 
 * @param {*} callback 
 */

const csvToJson = function csvToJson(csvFileFolderPath, jsonFileFolderPath, filename, callback) {
    return new Promise((resolve, rejects) => {

        try {
            let validArguments = checkArguments(arguments);
            if (!validArguments) {
                rejects('Some parameter is not supplied');
                return
            }

            let files = fs.readdirSync(csvFileFolderPath);
            console.log(`read files are: ${files}`);

            let isCsvFilePresentToRead = files.includes(filename);
            if (!isCsvFilePresentToRead) {
                const error = `${filename} file not found in the directory: ${csvFileFolderPath}`;
                console.log(error);
                rejects(error);
            }

            helperCsvToJSON(filename, csvFileFolderPath, jsonFileFolderPath, callback)
                .then(result => {
                    // console.log(result.values)
                    console.log({
                        Status: 'SUCCESS',
                        Message: `CSV to JSON conversion of ${filename} file is completed`
                    });

                    resolve(`CSV to JSON conversion of ${filename} file went successfully`)
                }).catch(err => {
                    console.log({
                        MESSAGE: `Converting CSV to JSON of ${filename} failed`,
                        ERROR: err
                    });

                    rejects(err);
                });
        } catch (error) {
            console.log('Something went wrong while conversion from csv to json');
            console.log(error);
            rejects('Something went wrong while converting csv to json');
        }
    })
}

module.exports = {
    convertCsvToJson: csvToJson
};