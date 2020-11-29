const path = require("path");
const fs = require('fs');
const hp_CsvToJson = require('../helper/csvToJson');
const mw_Upload = require("../middleware/upload");
const HorizontalLineStar = '****************************************************************************************************************';

/**
 * 
 * @param {string} fileName is the csv file that needs to be converted to json file
 * @param {string} csvFileFolderPath folder path from where the files are meant to be read
 * @param {string} jsonFileFolderPath folder path where json file are to be written after conversion
 * @param {function} callback is executed after the conversion of the file is completed
 * @returns promise
 */
const convertCsvFiles = (fileName, csvFileFolderPath, jsonFileFolderPath, callback) => {
    return new Promise((res, rej) => {
        try {
            console.log(`Reading file ${fileName}.............`);

            // converting the file from the provide folder path
            hp_CsvToJson.convertCsvToJson(csvFileFolderPath, jsonFileFolderPath, fileName, function cb() {
                if (callback && typeof(callback) === 'function') {
                    callback();
                }
            }).then(response => {
                res(response);
            }).catch(error => {
                console.log(`CSV to JSON conversion failed, Some error occurred in convertCsvFiles function`);
                rej(error);
            })
        } catch (error) {
            console.log(`CSV to JSON conversion failed, Some error occurred`);
            console.log(error);
            rej(`CSV to JSON conversion failed, Some error occurred`);
        }
    })
}


/**
 * Deletes the existing files in the given directory path
 *
 * @param {*} path is the path of the directory you want to delete all files from.
 * @return {*} true if deleted, false otherwise
 */
const deleteFiles = function deleteFiles(path) {
    if (!path) return "No path supplied";
    let files = fs.readdirSync(path);

    if (files.length) {
        console.log('FILES to be deleted are:')
        console.log(files);

        let pathsOfFiles = files.map(file => `${path}/${file}`);
        console.log('Path of the file to be deleted are:');
        console.log(pathsOfFiles);

        pathsOfFiles.forEach(file => {
            if (fs.existsSync(file)) {
                fs.unlinkSync(file);
                return true;
            } else {
                console.log(`File not found: ${file}`);
            }
        });
        return true;
    } else {
        console.log('No files found in dir:' + path);
        return false;
    }
}

const _deleteFiles = (paths) => {
    paths.forEach(path => deleteFiles(path));
}


const multipleUpload = async(req, res) => {
    try {
        const csvFileFolderPath = path.join(`${__dirname}/../public/files/uploadedFile`);
        const jsonFileFolderPath = path.join(`${__dirname}/../public/files/convertedFile`);

        // deleting files that were already present if any
        _deleteFiles([csvFileFolderPath, jsonFileFolderPath])

        // await is not used, else it will block the thread.
        mw_Upload.uploadFiles(req, res, function(err) {
            if (err) {
                console.log({
                    Description: 'Failed to process the uploaded file, writing to directory failed.',
                    Error: err
                });

                res.json({ error_code: 1, err_desc: err });
                return;
            }

            /** Check the extension of the incoming file and
             *  use the appropriate module
             */
            let files = req.files;
            console.log(HorizontalLineStar);
            console.log('Received files are:\n');
            console.log(files);
            console.log(`${HorizontalLineStar}\n\n\n\n`);

            Promise.all(files.map(file => convertCsvFiles(file.filename, csvFileFolderPath, jsonFileFolderPath)))
                .then(value => {
                    // sending response
                    _writeResponse(req, res, value);
                }).catch(err => {
                    _handleError(req, res, err);
                });
        })
    } catch (error) {
        console.log(error);
        if (error.code === "LIMIT_UNEXPECTED_FILE") {
            return res.send("Too many files to upload.");
        }
        return res.send(`Error when trying upload many files: ${error}`);
    }
};

const _writeResponse = (req, res, value) => {
    let file = fs.readFileSync(`${__dirname}/../public/postData.html`, { encoding: 'utf8', flag: 'r' });
    res.writeHeader(200, { "Content-Type": "text/html" });
    res.write(file);
    res.end();

    console.log(HorizontalLineStar);
    console.log('Reading and processing of uploaded files are completed');
    console.log(value);
    console.log(`${HorizontalLineStar}\n\n`);
}

const _handleError = (req, res, err) => {
    res.writeHeader(400, { "Content-Type": "text/html" });
    res.write('Something went wrong, try again');
    res.end();
    console.log(HorizontalLineStar);
    console.log({
        MESSAGE: 'Reading and processing of uploaded files are failed',
        ERROR: err
    })
    console.log(`${HorizontalLineStar}\n\n`);
}

module.exports = {
    multipleUpload: multipleUpload,
    _deleteFiles: _deleteFiles,
    _handleError: _handleError,
    _writeResponse: _writeResponse,
    convertCsvFiles: convertCsvFiles,
};