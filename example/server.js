const http = require("http");

const host = 'localhost';
const port = 5000;

const requestListener = function (req, res) {
console.log(req.headers);
if (req.method === 'POST') {
    // I have added handling of post so keyclock admin url can  send something here to see what it sends. it sends a sort of token with signed valus.
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString(); // convert Buffer to string
    });
    req.on('end', () => {
        console.log(body);
	try{
	 let data1 = Buffer.from(body.split('.')[0], "base64").toString('utf-8');
	 console.log(data1);

	 let data2 = Buffer.from(body.split('.')[1], "base64").toString('utf-8');
	 console.log(data2);

        }catch(e){console.log(body);}
	res.end('{"hello":"post"}')
    });
}
else
{ 
 res.end('{"hello":"world"}')
}
};

const server = http.createServer(requestListener);
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});