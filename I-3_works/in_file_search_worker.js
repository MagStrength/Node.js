import worker_threads from 'worker_threads';
import fs, { closeSync } from 'fs';
import readline from 'readline';
import { Stream } from 'stream';
const newStream = fs.createReadStream(worker_threads.workerData.path, 'utf-8');
const outStream = new Stream();
const readLineFromStream = readline.createInterface(newStream, outStream);
const writeStreams = {};
const IPs = worker_threads.workerData.IPs;

IPs.forEach((IP) => {
    writeStreams[IP] = fs.createWriteStream(`${IP}_requests.log`, {
        encoding: 'utf-8',
        flags: 'a'
    });

});

readLineFromStream.on('line', (line) => {
    if (line.length == 0) { return; }

    IPs.forEach((IP) => {
        if (line.indexOf(IP) !== -1) {
            writeStreams[IP].write(line + '\n');
        }
    });
});

worker_threads.parentPort.postMessage('ok');