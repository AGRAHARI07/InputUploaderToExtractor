const path = require("path");

const home = (req, res) => {
    let filePath = path.join(`${__dirname}/../public/index.html`)
    return res.sendFile(filePath);
};

module.exports = {
    getHome: home
};