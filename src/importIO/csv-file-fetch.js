const fetch = require('node-fetch');
const { createWriteStream } = require('fs');
const config = process.env;


const downloadFile = (async(url, path) => {
    if (!url) throw Error(`fetch url not found: ${url}`);
    if (!path) throw Error(`path to save file not passed: ${path}`);

    const res = await fetch(url);
    const fileStream = createWriteStream(path);
    return new Promise((resolve, reject) => {
        res.body.pipe(fileStream);
        res.body.on("error", reject);
        fileStream.on("finish", resolve);
    });
});

const csvFile = (extractorId, path) => {
    const apiKey = config.API_KEY;
    const baseUrl = config.BASE_URL;
    
    if (!extractorId) throw Error(`extractor id not found: ${extractorId}`);
    if (!path) throw Error(`path to save csv file not passed: ${path}`);
    if(!(apiKey && baseUrl)) throw Error('API or base URL not specified, check your configuration')

    const url = `${baseUrl}${extractorId}/csv/latest?_apikey=${apiKey}`;

    return new Promise((res, rej) => {
        downloadFile(url, path)
            .then(r => {
                console.log('file downladed successfully..');
                res(r);
            })
            .catch(e => {
                console.log('file downloading failed');
                rej(e)
            });
    })
}

module.exports = {
    fetchCsvFile: csvFile
}