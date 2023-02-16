import http from 'http';
import { Server } from 'socket.io';
import fs from 'fs';
import path from 'path';
const HTML_TO_DISPLAY = path.join(path.resolve(), 'chat.html');

const server = http.createServer((req, res) => {
    const readStream = fs.createReadStream(HTML_TO_DISPLAY);
    res.writeHead(200, { 'Content-Type': 'text/html' });
    readStream.pipe(res);
}).listen(4444, 'localhost');

const io = new Server(server);

io.on('connection', (client) => {
    const userCount = io.engine.clientsCount;
    const userName = generateUserName();

    //пересчитываем количество пользователей в чате
    client.broadcast.emit('changeUserCount', userCount);
    client.emit('changeUserCount', userCount);

    //указываем для пользователя его имя
    client.emit('setName', userName);

    //сообщяаем в чат, что зашел новый пользователь
    client.broadcast.emit('addUser', userName);

    //сообщяаем в чат, что зашел новый пользователь
    client.on('disconnect', () => {
        client.broadcast.emit('leftUser', userName);
        client.broadcast.emit('changeUserCount', io.engine.clientsCount);
    });

    client.on('newMessage', (payload) => {
        const msg = {
            user: userName,
            text: payload
        };
        client.broadcast.emit('newChatMessage', msg);
        client.emit('newChatMessage', msg);
    });
});

const generateUserName = () => {
    return 'user#' + (Date.now()).toString().substr(-5);
};