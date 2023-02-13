import http from "http";
import fs from "fs";
import path from "path";
import { Transform } from "stream";

const host = "localhost";
const port = 3000;

const list = [];
const fsp = fs.promises;

const links = (arr, curUrl) => {
    if (curUrl.endsWith("/")) curUrl = curUrl.substring(0, curUrl.length - 1);
    let li = "";
    for (const item of arr) {
        li += `<li><a href="${curUrl}/${item}">${item}</a></li>`;
    }
    return li;
};

const server = http.createServer((req, res) => {
    if (req.method === "GET") {
        const url = req.url.split("?")[0];
        const curPath = path.join(process.cwd(), url);

        fs.stat(curPath, (err, stats) => {
            if (!err) {
                if (stats.isFile(curPath)) {
                    const rs = fs.createReadStream(curPath, "utf-8");
                    rs.pipe(res);
                } else {
                    fsp
                        .readdir(curPath)
                        .then((files) => {
                            if (url !== "/") files.unshift("..");
                            return files;
                        })
                        .then((data) => {
                            const filePath = path.join(process.cwd(), "./index.html");
                            const rs = fs.createReadStream(filePath);
                            const ts = new Transform({
                                transform(chunk, encoding, callback) {
                                    const li = links(data, url);
                                    this.push(chunk.toString().replace("The first html-page", li));

                                    callback();
                                },
                            });

                            rs.pipe(ts).pipe(res);
                        });
                }
            } else {
                res.end("Path not exists");
            }
        });
    }
});

server.listen(port, host, () =>
    console.log(`Server running at http://${host}:${port}`)
);
