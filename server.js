require('babel-polyfill')
require('babel-register')

const express = require('express');
const app = express();
const {serverRender} = require('./app/server')
const path = require('path');
const http = require('http');


this.comments = []

app.set('port', 3000)

app.use((request, response) => {
    console.log(request.method)
    response.end(serverRender(this.comments))
})

app.post('/publish', (request, response) => {
    console.log(request)
})

http.createServer(app).listen(app.get('port'), () => {
    console.log(`Server start on port ${app.get('port')}`)
})
