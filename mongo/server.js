const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const passwordHash = require('password-hash');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
let db;
const url = 'mongodb://localhost:27017';
let promises = [];

const fs = require('fs');

// Database Name
const dbName = 'airdata';


const client = new MongoClient(url, { useUnifiedTopology: true, useNewUrlParser: true });
// Use connect method to connect to the server

const exportData = () => {
    client.connect(function (err) {
        assert.equal(null, err);
        db = client.db(dbName);
        findDocuments({}, (res) => {
            safeData(JSON.stringify(res));
            client.close();
        });
    });
    setTimeout(() => { exportData() }, 100000);
}
exportData();


const safeData = (data) => {
    fs.writeFile("./data/data.json", data, function (err) {

        if (err) {
            return console.log(err);
        }

        console.log("The file was saved!");
    });
}

const findDocuments = function (search, callback) {
    // Get the documents collection
    const collection = db.collection('airdata');
    // Find some documents
    collection.find(search).toArray(function (err, docs) {
        assert.equal(err, null);
        console.log("Found the following records");
        callback(docs);
    });
}

client.connect(function (err) {
    assert.equal(null, err);
    console.log("Connected correctly to server");

    db = client.db(dbName);


});


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
        var hashedPassword = 'sha1$20b3ea03$1$21d606c95ce64b61e0bd5465b3c798b2ec7b24b2';
        if (passwordHash.verify(req.body.pwd, hashedPassword)) {
            let rec = req.body.data;
            console.log("Incoming Data, " + JSON.stringify(req.body.data.length) + " data points. \n Sending now:");
            for (let i = 0; i < req.body.data.length; i++) {
                let json = {
                    time: Date.now(),
                    content: rec[i],
                }
                insertDocuments(json).then(result => {
                    console.log("Data point " + i + " published with result: " + result);
                    if (i == req.body.data.length - 1) {
                        res.json({
                            msg: "published",
                            result: result
                        })
                    }
                }).catch(err => {
                    console.log("Data point " + i + " error with result: " + err);
                    res.json({
                        msg: "failed to publish",
                        result: err
                    })
                });
            }

        } else {
            res.json({ msg: "wrong password" });
        }
    });
}

const insertDocuments = (data) => {
    return new Promise((res, rej) => {
        const collection = db.collection('airdata');
        collection.insertOne(data, function (err, result) {
            assert.equal(err, null);
            res(result);
            rej(err);
        });
    })
}
//console.log(passwordHash.generate(''));
listener();
