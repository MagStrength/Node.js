import fs from 'fs';
import path from 'path';
import http from 'http';
import { Server } from 'socket.io';
const HTML_TEMPLATE = './fileManager_template.html';
const HTML_TO_DISPLAY = path.join(path.resolve(), 'fileManager.html');

const isDir = (dirPath) => fs.lstatSync(dirPath).isDirectory();

const server = http.createServer((req, res) => {
    const reqPath = path.join(path.resolve(), req.url);

    if (isDir(reqPath)) {
        const dirContent = fs.readdirSync(reqPath);
        makeResultHTML(displayDirContent(req.url, dirContent));
    } else {
        makeResultHTML(fs.readFileSync(reqPath, 'utf-8'));
    }


    const readStream = fs.createReadStream(HTML_TO_DISPLAY);
    res.writeHead(200, { 'Content-Type': 'text/html' });
    readStream.pipe(res);
}).listen(4444, 'localhost');

const io = new Server(server);

const displayDirContent = (currentPath, list) => {
    let htmlList = '';
    htmlList += '<ul>';
    htmlList += list.reduce((list, item) => list += `<li><a href="${currentPath == '/' ? currentPath + item : currentPath + '/' + item}">${item}</a></li>`, '');
    htmlList += '</ul>';
    return htmlList;
};

const makeResultHTML = (toPresent) => {
    let template = fs.readFileSync(HTML_TEMPLATE, 'utf-8');
    template = template.replace('{{data}}', toPresent);
    fs.writeFileSync(HTML_TO_DISPLAY, template);
};

io.on('connection', (client) => {
    const userCount = io.engine.clientsCount;
    client.broadcast.emit('changeUserCount', userCount);
    client.emit('changeUserCount', userCount);

    client.on("disconnect", () => {
        client.broadcast.emit('changeUserCount', io.engine.clientsCount);
    });
});