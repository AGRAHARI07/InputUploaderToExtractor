const fetch = require('node-fetch');
const config = require('../configurations.json');

/**
 * It uses import API and the API key of the deloitte account to put the data provided as an input to the extractor
 * 
 * @param {string} extractorId is the extractor id on which need to PUT data
 * @param {string} dataToUpload is the data to PUT on the extractorId provided
 * @return {Object} JSON object response obtained from the import API,
 * 
 * It throws the error message as "Failed to PUT the data on extractor" if something goes wrong at Import server side 
 */

const PUTInputData = async function postInputData(extractorId, dataToUpload) {
    const key = config.apiKey;
    let res = await fetch(`https://store.import.io/store/extractor/${extractorId}/_attachment/inputs?_apikey=${key}`, {
        method: 'PUT',
        body: dataToUpload,
        headers: { 'Content-Type': 'application/json' },
    });

    if (res.status === 200) {
        res = await res.json();
        return res;
    } else {
        throw new Error('Failed to PUT the data on extractor');
    }
};

module.exports = {
    PUTInputDataToExtractor: PUTInputData
};