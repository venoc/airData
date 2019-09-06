
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const { publish } = require('./iota');
const { debug, serverUrl } = require('./config.json');

const listener = async () => {
    let app = express();
    app.use(cors());
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());
    app.set('json spaces', 40);
    app.listen(8020, function () {
        console.log("Data Pusher is listening on port 8020");
    });
    app.post('/data', function (req, res, next) {
        console.log(req.body);
        publish(req.body).then(res => {console.log(res)}).catch(err => {console.log(err)});
    });
}
listener();