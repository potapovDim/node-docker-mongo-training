const express = require('express');
const app = express();
// const routes = require('./routes')
// const user = require('./routers/user')
const path = require('path');
const http = require('http');

app.set('port', 3000)

http.createServer(app).listen(app.get('port'), () => {
    console.log(`Server start on port ${app.get('port')}`)
})