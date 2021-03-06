const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const Mam = require('@iota/mam');
Mam.init('https://nodes.devnet.thetangle.org:443');
const iota = require('iota.crypto.js');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
let db;
// Connection URL
const url = 'mongodb://localhost:27017';

const fs = require('fs');

// Database Name
const dbName = 'myproject';


const client = new MongoClient(url, { useUnifiedTopology: true, useNewUrlParser: true });
// Use connect method to connect to the server

const exportData = () => {
    return new Promise((res, rej) => {
        client.connect(function (err) {
            assert.equal(null, err);
            console.log("Connected correctly to server");
    
            db = client.db(dbName);
    
            findDocuments({}, (res) => {
                let min = findEarliest(res);
                let max = findLatest(res);
                let data = {
                    earliestTime: min,
                    latestTime: max,
                    data: res
                }
                let input = "const data = " + JSON.stringify(data);
                safeData(input);
                client.close();
                res(true);
            });
    
        });
    })

}


const safeData = (data) => {
    fs.writeFile("./tmp/data.js", data, function (err) {

        if (err) {
            return console.log(err);
        }

        console.log("The file was saved!");
    });
}

const findEarliest = function (res) {
    let max = 2569421456919;
    for (let i = 0; i < res.length; i++) {
        if (res[i].time < max) {
            max = res[i].time;
        }
    }
    return max;
}
const findLatest = function (res) {
    let max = 0;
    for (let i = 0; i < res.length; i++) {
        if (res[i].time > max) {
            max = res[i].time;
        }
    }
    return max;
}


const findDocuments = function (search, callback) {
    // Get the documents collection
    const collection = db.collection('scooter01');
    // Find some documents
    collection.find(search).toArray(function (err, docs) {
        assert.equal(err, null);
        console.log("Found the following records");
        callback(docs);
    });
}
module.exports = exportData;