import worker_threads from 'worker_threads';
const TEST_FILE = './access_tmp.log';

let IPs = process.argv.slice(2);

if (IPs.length == 0) {
    IPs = ['89.123.1.41', '34.48.240.111'];
}

(async () => {
    const worker = new worker_threads.Worker('./in_file_search_worker.js', {
        workerData: {
            path: TEST_FILE,
            IPs: IPs
        }
    });
})();

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
                            // render
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