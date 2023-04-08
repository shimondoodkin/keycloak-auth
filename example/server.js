const http = require("http");

const host = 'localhost';
const port = 5000;

const requestListener = function (req, res) {
console.log(req.headers)
res.end('{"hello":"world"}')
};

const server = http.createServer(requestListener);
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});