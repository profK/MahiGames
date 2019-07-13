"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
var port = process.env.port || 1337;
let fs = require('fs');
fs.readFile('index.html', function (err, html) {
    if (err) {
        throw err;
    }
    http.createServer(function (req, response) {
        response.writeHead(200, { "Content-Type": "text/html" });
        response.write(html);
        response.end();
    }).listen(port);
});
//# sourceMappingURL=server.js.map