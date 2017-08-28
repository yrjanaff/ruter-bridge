const bodyParser = require('body-parser');
const ruterhandler = require('./ruter.js')
const express = require('express');
const app = express();

const port = process.env.PORT || 3000

debug.log = console.log.bind(console);


app.use(bodyParser.json());
process.env.DEBUG = 'actions-on-google:* node index.js'

app.post('/ruter', ruterhandler.findBus);

app.listen(port, function () {
  console.log('Example app listening on port 3000!')
})
