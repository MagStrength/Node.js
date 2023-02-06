const fs = require('fs');
const readline = require('readline');

const ACCESS_LOG = './accesstest.log';
const IP_1 = './89.123.1.41_requests.log';
const IP_2 = './34.48.240.111_requests.log';

const readStream = fs.createReadStream(ACCESS_LOG, {
    encoding: 'utf-8'
})
const writeStream1 = fs.createWriteStream(IP_1, {
    encoding: 'utf-8',
    // flags: 'a'
})
const writeStream2 = fs.createWriteStream(IP_2, {
    encoding: 'utf-8',
    //  flags: 'a'
})

let numStr = 0;

const readLine = readline.createInterface({
    input: readStream,
});

readLine.on('line', (line) => {
    if (line.includes("89.123.1.41")) {
        writeStream1.write(line + "\n")
    }
    if (line.includes("34.48.240.111")) {
        writeStream2.write(line + "\n")
    }
    console.log(++numStr)
})