const fs = require('fs');

function readFileSync(fileToReadFolderPath) {
    let inputJsonFileName = fs.readdirSync(fileToReadFolderPath).filter(file => file.includes(`json`))[0];

    if (!inputJsonFileName) {
        console.log(`No json file found in the directory: ${fileToReadFolderPath}`);
        return;
    }
    const jsonFilePath = `${fileToReadFolderPath}/${inputJsonFileName}`;
    console.log(`jsonFilePath: ${jsonFilePath}`);

    const returnJsonData = fs.readFileSync(jsonFilePath, { encoding: 'utf8', flag: 'r' });
    console.log(`Reading of file completed...`);
    return returnJsonData;
}

async function readFileAsync(fileToReadFolderPath, callbackFunction) {
    let inputJsonFileName = fs.readdirSync(fileToReadFolderPath).filter(file => file.includes(`json`))[0];

    const jsonFilePath = `${fileToReadFolderPath}/${inputJsonFileName}`;
    console.log(`jsonFilePath: ${jsonFilePath}`);

    let returnJsonData;
    returnJsonData = fs.readFile(jsonFilePath, 'utf8', function(err, data) {
        if (err) throw err;
        callbackFunction(data);
        console.log(`Reading successful, length: ${data.length}`);
    });

    return returnJsonData;
}

// function readFileAsync(inputFolder) {
//     (async function() {
//         readFileAsync(inputFolder, function(data) {
//             console.log(`Length: ${data.length}`);
//             console.log(`Type: ${typeof data}`);
//             console.log(data.split(`name`)[0]);
//         }).catch(error => console.log(error.message))

//     })();
// }

// const inputFolder = `./public/files/convertedFile`;

// console.log(data);
// console.log(`JSON: ${JSON.parse(data)}`);

module.exports = { readFileSync, readFileAsync };