const fs = require('fs');
const readline = require('readline');
const path = require('path');

const utilities = require('./utilities');
const config = process.env;
let uniqUrlArr = []; // global array to store unique values from all the files if de-dup required.

const modifySingleFile = function modifySingleFile(folderPath, jsonFile, needToDeDup, oldAndNewKeys, keyToAppendIn_url) {
    return new Promise((res, rej) => {
        try {
            const filePath = `${folderPath}/${jsonFile}`;
            const writeFile = `${folderPath}/${config.fileNameKeyReplacedJson}.json`;
            let lineReader = readline.createInterface({
                input: fs.createReadStream(filePath, { encoding: 'utf8', flag: 'r' }),
                terminal: false
            });

            let formatted_data = "";
            let originalFileLineNoCounter = 0;
            let processedLineNoCounter = 0;
            let skippedLineCounter = 0;
            let filterBasedOn = '_url';

            // processing each line
            lineReader.on('line', function(line) {
                originalFileLineNoCounter++;
                // modifying the line chunk as per the requirement of the import format after parsing it to json
                let parsedJsonLine = "";
                try {
                    let jsonChunk = {};
                    try {
                        jsonChunk = JSON.parse(line);
                    } catch (error) {
                        console.log('Error while parsing this below line');
                        console.log(line);
                        console.log(error);
                        skippedLineCounter++;
                    }
                    parsedJsonLine = jsonChunk ? utilities._replaceKeys(oldAndNewKeys, keyToAppendIn_url, jsonChunk) : skippedLineCounter++;

                    // by default, all line will be processed, else based on the de-duping conditions
                    let needToProcess = true;

                    // if we need to filter i.e de-dup
                    if (needToDeDup && parsedJsonLine) {
                        let url = parsedJsonLine[filterBasedOn];
                        if (!uniqUrlArr.includes(url)) {
                            uniqUrlArr.push(parsedJsonLine[filterBasedOn])
                            needToProcess = true;
                        } else {
                            needToProcess = false;
                        }
                    }

                    // by default processing all line, if no de-duping based conditions are provided
                    if (needToProcess && parsedJsonLine) {
                        // console.log(`\n------------------------------------------------ Line no processed: ${originalFileLineNoCounter} ------------------------------------------------`);
                        // console.log(parsedJsonLine);
                        let data = `${JSON.stringify(parsedJsonLine)}\n`;
                        fs.appendFile(writeFile, data, 'utf8', function(err) {
                            if (err) return console.log(err);
                        });

                        // console.log(data);
                        formatted_data += data;
                        processedLineNoCounter++;
                    } else {
                        // console.log(`\n------------------------------------------------ Line no ${originalFileLineNoCounter} is Duplicate ------------------------------------------------`);
                    }
                } catch (error) {
                    console.log('Something went wrong');
                    console.log(error);
                    skippedLineCounter++;
                }
            });


            lineReader.on('close', _ => {
                console.log(`====================================================================================`);
                console.log('FILEPATH:' + filePath);
                console.log('Whole file processed successfully');
                console.log(`De-dup opted: ${needToDeDup}`);
                console.log(`keyToAppendIn_url: ${keyToAppendIn_url}`);
                console.log(`Original File size: ${originalFileLineNoCounter}`);
                console.log(`Skipped no of lines: ${skippedLineCounter}`);
                console.log(`Transformed file size: ${processedLineNoCounter}`);

                res(formatted_data);
                return
            });
        } catch (error) {
            console.log(error);
            rej('Reading file line by line failed');
            return;
        }
    })
}

const getJsonFiles = (filesRootDirPath) => {
    const files = fs.readdirSync(filesRootDirPath);
    let fileNames = files.filter(file => file.includes(`${config.fileNameUploadedFromServerInJson}`));
    return fileNames
}


/**
 *It process the json data based on the param provided before PUT to the import extractor
 *
 * @param {JSON} body is the api request body as JSON
 * @return {Promise} rejects if some error occurs, else resolves with the modifiedJson data
 */
const modifyJsonFilesData = (body) => {
    return new Promise(function(res, rej) {
        try {
            let oldAndNewKeys = body.columnValues;
            let needToDeDup = body.deDup;
            let keyToAppendIn_url = body.tag;

            const folderPath = path.join(`${__dirname}/../public/files/convertedFile`);

            const originalJsonFiles = getJsonFiles(folderPath);

            if (!originalJsonFiles.length) { rej('No files found to read'); return }

            let returnData = '';
            // modifying all the json files as per import request body
            Promise.all(originalJsonFiles.map(jsonFile => modifySingleFile(folderPath, jsonFile, needToDeDup, oldAndNewKeys, keyToAppendIn_url)))
                .then(data => {
                    data.forEach(fileData => {
                        returnData += fileData;
                    })
                    res(returnData)
                    return;
                }).catch(err => {
                    console.log('File modification fails');
                    rej(err);
                    return;
                })

        } catch (error) {
            console.log('Transformation of JSON file failed');
            rej(error);
            return;
        }
    })
}

module.exports = {
    modifyJsonFile: modifyJsonFilesData
};