const fetch = require('node-fetch');
const Mam = require('@iota/mam');
const { trytesToAscii } = require('@iota/converter');
const userId = 'teGsLbKN33RxY5ZOCv9SNXBQsWf2';
const config = require('./config.json');
//const deviceId = 'BD-XDK-Weather';
const apiKey = '3df67909-3ac2-474d-b4a7-54e3633cddc3';

const fund = async () => {
    const response = await fetch('https://api.marketplace.tangle.works/wallet',
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: userId
            })
        });
    const json = await response.json();
    console.log(json);
}

const userInfo = async () => {
    const response = await fetch('https://api.marketplace.tangle.works/user?userId=' + userId);
    const json = await response.json();
    console.log(json);
}
const showData = raw => {
    const data = trytesToAscii(raw);
    console.log("data");
}
Mam.init('https://nodes.devnet.thetangle.org:443');
const readMam = async () => {
    try {
        await Mam.fetch('SBZDZBZWRSWJJLXCQMKVDPIBLOXMDCXGUZENPEKZBCQYAQEWSJYYTHHZLIA9COABJUGWGZGZ99JOJPCNF', 'restricted', 'KIHGJCNTTVNEGNPWYPMJPOLRTFRQZYKLCM9CYFIYDWXZPQMBCMRYVAKBCDGINGTPBRLSXDLKCZGVVYFTL', showData);
    } catch (e) {
        console.log(e)
    }
}

const queryStream = async () => {
    console.log(config.sensorId);
    const response = await fetch('https://api.marketplace.tangle.works/stream?deviceId=' + config.sensorId + '&userId=' + userId + '&time=1566382680000');
    const json = await response.json();
    console.log(json);
}

const buyStream = async () => {
    const response = await fetch('https://api.marketplace.tangle.works/purchaseStream',
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: userId,
                deviceId: deviceId
            })
        });
    const json = await response.json();
    console.log(json);
}

const userDevices = async () => {
    const response = await fetch('https://api.marketplace.tangle.works/devices?userId=' + userId + '&apiKey=' + apiKey);
    const json = await response.json();

    console.log(json);
}
//queryStream();
readMam();