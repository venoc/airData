const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
let db;
// Connection URL
const url = 'mongodb://localhost:27017';

const fs = require('fs');

// Database Name
const dbName = 'airdata';


const client = new MongoClient(url, { useUnifiedTopology: true, useNewUrlParser: true });
// Use connect method to connect to the server

const exportData = () => {
    new Promise((res, rej) => {
        client.connect(function (err) {
            assert.equal(null, err);
            console.log("Connected correctly to server");
            db = client.db(dbName);
            findDocuments({}, (res) => {
                safeData(JSON.stringify(res));
                client.close();
                res(true);
            });
        });
    });
}


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

module.exports = exportData;