const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const Mam = require('@iota/mam');
Mam.init('https://nodes.devnet.thetangle.org:443');
const iota = require('iota.crypto.js');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
let db;
// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'myproject';

let promises = [];

const client = new MongoClient(url, { useUnifiedTopology: true, useNewUrlParser: true });
// Use connect method to connect to the server

client.connect(function (err) {
    assert.equal(null, err);
    console.log("Connected correctly to server");

    db = client.db(dbName);


});


const insertDocuments = function (data, callback) {
    // Get the documents collection
    const collection = db.collection('scooter01');
    // Insert some documents
    collection.insertOne(data, function (err, result) {
        assert.equal(err, null);
        callback(result);
    });
}

async function queryStream(timestampStart, timestampEnd) {
    return new Promise((res, rej) => {
        var url = 'https://api.marketplace.tangle.works/stream?deviceId=' + "scooter-01" + '&userId=' + '####USERID####' + '&time=' + timestampStart;
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", url, true); // false for synchronous request
        xmlHttp.send(null);
        xmlHttp.onload = function () {
            let status = xmlHttp.status; // HTTP response status, e.g., 200 for "200 OK"
            let array = JSON.parse(xmlHttp.responseText);
            timestampStart = array[array.length - 1].time;
            //for(let i = 0; i < array.length; i++) {
            //readMam(array[i].root, array[i].sidekey);
            readMam(array, 0);
            //}
            if (timestampStart > timestampEnd) {
                setTimeout(() => {
                    queryStream(timestampStart, timestampEnd).then(result => {
                        res(array.concat(result));

                    })
                }, 8000);

            } else {
                res(array);
            }
        }
    });
}

async function readMam(array, index) {
    try {
        promises.push(new Promise((resolve, reject) => {
            // console.log(array[index]);
            Mam.fetch(array[index].root, 'restricted', array[index].sidekey, showData, 1).then(res => {
                //console.log(index);
                if (index < array.length - 1)
                    setTimeout(() => { readMam(array, ++index), 100 });
                resolve(res);
            }).catch(err => {
                console.log('err', err)
            });
        }));
    } catch (e) {
        console.log("err: ", e);
    }
}

const showData = raw => {
    if (raw != null) {
        const data = iota.utils.fromTrytes(raw);
        const jsonData = JSON.parse(data);
        //  console.log(jsonData);  
        insertDocuments(jsonData, () => {});
        console.log(jsonData);
        //mamData.push(jsonData);
    }
}


const findDocuments = function (db, callback) {
    // Get the documents collection
    const collection = db.collection('documents');
    // Find some documents
    collection.find({}).toArray(function (err, docs) {
        assert.equal(err, null);
        console.log("Found the following records");
        console.log(docs)
        callback(docs);
    });
}


//queryStream('1569421456919', '1568732378567');
//queryStream('1568732288063', '1568732378567');
//queryStream('1569452125301', '1569421455970');
//queryStream('1569944911875', '1569452125301');
queryStream('1569944911875', '1568732378567');
