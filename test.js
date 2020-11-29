const fs = require('fs')
const utilities = require('./utilities');
const config = require('./configurations.json');
const readline = require('readline');

// const folder = `./public/files/convertedFile`;
// const readFilePath = `${folder}/modified.json`;
// const writePath = `${folder}/de-dup.txt`;
// const transformer = new Filter()

// const input = Fs.createReadStream(readFilePath)
// const output = Fs.createWriteStream(writePath)

// input.pipe(transformer).pipe(output)

const folderPath = `./public/files/convertedFile`;
const jsonFile = fs.readdirSync(folderPath).filter(file => file.includes(`${config.fileNameUploadedFromServerInJson}.json`))[0];
if (!jsonFile) {
    const error = `No json file found in the directory: ${folderPath}`;
    console.log(error);
    throw new Error(error);
}

const filePath = `${folderPath}/${jsonFile}`;
const writeFile = `${folderPath}/test.json`;
let lineReader = readline.createInterface({
    input: fs.createReadStream(filePath, { encoding: 'utf8', flag: 'r' }),
    terminal: false
});

let formatted_data = ""
let needToDeDup = true;
let uniqUrlArr = []
let filterBasedOn = 'url';
lineReader.on('line', function(line) {
    let parsedJsonLine = utilities._replaceKeys(oldAndNewKeys, JSON.parse(line));
    // if we need to filter i.e de-dup
    let needToProcess = true;
    if (needToDeDup) {
        let url = parsedJsonLine[filterBasedOn];
        if (!uniqUrlArr.includes(url)) {
            uniqUrlArr.push(parsedJsonLine[filterBasedOn])
            needToProcess = true;
        } else {
            needToProcess = false;
        }
    }

    if (needToProcess) {
        console.log(parsedJsonLine);
        let data = `${JSON.stringify(parsedJsonLine)}\n`;
        fs.appendFile(writeFile, data, 'utf8', function(err) {
            if (err) return console.log(err);
        });

        // console.log(data);
        formatted_data += data;
    }

});
lineReader.on('close', _ => console.log('de-duping completed'));