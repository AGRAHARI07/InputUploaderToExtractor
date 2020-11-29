const path = require("path");
const multer = require("multer");
const config = require('../configurations.json');

function getNumberOfCount(req) {
    const fileCount = req.files.length;
    return fileCount
}

const storage = multer.diskStorage({ //multers disk storage settings
    destination: function(req, file, callback) {
        callback(null, path.join(`${__dirname}/../public/files/uploadedFile/`))
    },
    filename: function filename(req, file, callback) {
        console.log(file);
        let splitFileName = file.originalname.split('.');
        let fileExtension = splitFileName[splitFileName.length - 1];

        let count = getNumberOfCount(req);
        callback(null, `${config.fileNameUploadedFromServer}_${count}.${fileExtension}`)
    }
});

const uploadFiles = multer({ //multer settings
    storage: storage,
    fileFilter: function fileFilter(req, file, callback) { //file filter
        let splittedFileName = file.originalname.split('.')
        let fileExtensionIndex = ['csv'].indexOf(splittedFileName[splittedFileName.length - 1]);
        if (fileExtensionIndex === -1) {
            const message = `${file.originalname} is invalid. Only accept csv files`;
            return callback(message, null);
        }
        callback(null, true);
    }
}).array("multi-files", 15);


module.exports = {
    uploadFiles: uploadFiles
}