'use strict';

const path = require("path");
const fs = require('fs');
const firstLine = require('../helper/firstLine')



const getFirstLine = async(req, res) => {
    try {
        const folderPath = path.join(`${__dirname}/../public/files/uploadedFile`);
        const csvFile = fs.readdirSync(folderPath).filter(file => file.includes(`csv`))[0];
        if (!csvFile) {
            const error = `No csv file found in the directory: ${folderPath}`;
            console.log(error);
            res.json({ error_code: 404, err_desc: 'No file found' });
            res.end();
        }

        const filePath = `${folderPath}/${csvFile}`;
        let fileHeaders = await firstLine.getFirstLineHeader(filePath);
        fileHeaders = fileHeaders.split(`,`).filter(Boolean);
        console.log(`fileHeaders: ${fileHeaders}`);
        res.json({ file_headers: JSON.stringify(fileHeaders), status: 200 });
        res.end();
    } catch (error) {
        console.log('ERROR: Reading first line failed');
        console.log(error);
        res.json({
            file_headers: JSON.stringify(fileHeaders),
            status: 500
        });
        res.end();
    }
}

module.exports = {
    getFirstLine: getFirstLine
};