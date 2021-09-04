const postInputData = require('../middleware/putInput');
const preProcessor = require('../helper/preProcessData');

/**
 *Takes the extractor id, and the ndjson objects to post the data as input to extractor
 *
 * @param {*} extractorId  is the id on which data needs to be posted
 * @param {*} formatted_data is the ndjson object to be posted on the server
 * @return {*} A promise, resolves if the data is successfully posted else logs the error and throws back the same error
 */
function putData(extractorId, formatted_data) {
    return new Promise((resolve, reject) => {
        postInputData.PUTInputDataToExtractor(extractorId, formatted_data)
            .then(responseFromImport => {
                console.log(JSON.stringify(responseFromImport));
                resolve(responseFromImport);
            })
            .catch(error => {
                reject(error);
            });
    })
}

/**
 * It puts the input to extractor after processing as per the req body
 * 
 * @param req is the request header in the http request
 * @param res is the response sent from here, it contains the response obtained from the import server after PUT request.
 * 
 */
const putInputToExtractor = async (req, res) => {
    let body = req.body;
    let extractorId = body.extractorId;

    console.log('reading and processing file begin...');
    let startTime = new Date().getTime();
    preProcessor.modifyJsonFile(body)
        .then(formatted_data => {
            let endTime = new Date().getTime();
            console.log('reading and processing file completed... TIME TAKEN in ms: ' + (endTime - startTime));
            console.log('Sending the data to import server');

            startTime = new Date().getTime();

            putData(extractorId, formatted_data)
                .then(response => {
                    endTime = new Date().getTime();
                    console.log('Sending the data to import server completed... TIME TAKEN in ms: ' + (endTime - startTime));

                    res.writeHeader(200, {
                        "Content-Type": "text/html",
                        "statusText": "SUCCESS"
                    });
                    res.end();
                    return res;
                })
                .catch(error => {
                    res.writeHeader(400, {
                        "Content-Type": "text/html",
                        "statusText": "FAILED: Something went wrong while posting data to import tool, Sorry can't help it"
                    });

                    res.end();
                    throw error;
                })
        })
        .catch(error => {
            console.log('Something went wrong while pre processing the json file');
            console.log(error);

            res.writeHeader(400, {
                "Content-Type": "text/html",
                "statusText": "FAILED: Something went wrong while posting data to import tool, Sorry can't help it"
            });

            res.end();
            return res;
        })
};

module.exports = {
    putInputToExtractor: putInputToExtractor
};