'use strict';

const fs = require('fs');
let local = {};
if (fs.existsSync(`${__dirname}/config.local.js`))
    local = require(`${__dirname}/config.local.js`);

console.log('#local', require('util').inspect(local, 0, 10, 1));

module.exports = Object.assign({
    region: process.env.region,
    accessKeyId: process.env.accessKeyId,
    secretAccessKey: process.env.secretAccessKey,
    bucket: process.env.bucket,
}, local);
