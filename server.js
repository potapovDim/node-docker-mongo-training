const http = require('http');
const fs = require('fs');
const chat = require('./client')
const path = require('path');

http.createServer((request, response) => {
    switch (request.url) {
        case '/':
            sendFile(__dirname+'/index.html', response)
            break;
        case '/subscribe':
            chat.subscribe(request, response);
            break;
        case '/publish':
            chat.publish("...")
            break;
        default:
            response.statusCode = 404;
            response.end('Not found')
    }
}).listen(3000)

const sendFile = (fileName, response) => {
    const fileStream = fs.createReadStream(fileName);
    console.log(fileName)
    fileStream.on('error', () => {
        console.log(fileName)
        response.statusCode = 500;
        response.end('Server error');
    }).pipe(response)
}