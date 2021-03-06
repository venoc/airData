
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const { publish } = require('./iota');
const { debug, serverUrl } = require('./config.json');
const passwordHash = require('password-hash');


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
    app.post('/dataArray', function (req, res, next) {
            let rec = req.body.data;
            console.log("Incoming Data, " + JSON.stringify(req.body.data.length) + " data points. \n Sending now:");
            for (let i = 0; i < req.body.data.length; i++) {
                //console.log("Data Point" + i + ": " + JSON.stringify(rec[i]))
                publish(rec[i]).then(result => {
                    console.log("Data point " + i + " published with result: " + result); 
                    if(i == req.body.data.length - 1)
                        res.json({
                            msg: "published",
                            result: result
                        })
                }).catch(err => {
                    console.log("Data point " + i + " error with result: " + err); 
                        res.json({
                            msg: "failed to published",
                            result: err
                        })
                });
            }
    });
}

listener();
