'use strict';

const fs = require('fs');

const firstLine = (path, usrOpts) => {
    const opts = {
        encoding: 'utf8',
        lineEnding: '\n'
    };

    Object.assign(opts, usrOpts);
    return new Promise((resolve, reject) => {
        const readStream = fs.createReadStream(path, { encoding: opts.encoding });
        let data = '';
        let pos = 0;
        let index;
        readStream
            .on('data', chunk => {
                index = chunk.indexOf(opts.lineEnding);
                data += chunk;
                if (index === -1) {
                    pos += chunk.length;
                } else {
                    // first line crosses
                    pos += index;
                    readStream.close();
                }
            })
            .on('close', () => resolve(data.slice(data.charCodeAt(0) === 0xFEFF ? 1 : 0, pos)))
            .on('error', err => reject(err));
    });
};

module.exports = {
    getFirstLineHeader: firstLine
}