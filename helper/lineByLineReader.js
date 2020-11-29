const readline = require('readline');
const fs = require('fs');


const readInterface = (pathToFile) => readline.createInterface({
    input: fs.createReadStream(pathToFile, { encoding: 'utf8', flag: 'r' }),
    output: process.stdout,
    console: false
});


module.exports = (pathToFile, callBack) => {
    readInterface(pathToFile).on('line', callBack);
}