// TODO: 1. common count all request's with secret key

const crypto = require("crypto");
const fetch = () => require('node-fetch');
const Config = require("./config");

const generateSignature = (payload, secret) => {
    if (payload.constructor === Object)
        payload = JSON.stringify(payload);

    if (payload.constructor !== Buffer)
        payload = Buffer.from(payload, 'utf8');

    const signature = crypto.createHash('sha256');
    signature.update(payload);
    signature.update(new Buffer.from(secret, 'utf8'));
    return signature.digest('hex');
}

// //TODO: common code for all requests
// const fetchRequest = async () => {

// }

/**
 * 
 * @param {*} person : {firstName, lastName, idNumber}
 * @param {*} document : { number, type, country }
 * @returns 
 */
const start = async (person, document) => {
    try {
        const payload = {
            verification: {
                person, document, lang: 'en',
                features: ['selfid'],
                timestamp: timestamp()
            }
        };

        const headers = {
            'x-auth-client': Config.apiToken,
            'x-signature': generateSignature(payload, Config.apiSecret),
            'content-type': 'application/json'
        };

        const options = { method: 'POST', headers: headers, body: JSON.stringify(payload) };
        const response = await fetch()(Config.apiUrl + '/sessions', options);
        return await response.json();
    }
    catch (err) {
        console.log('veriff start function', err);
    }
}

const upload = async (verificationId, file) => {
    try {
        const payload = {
            image: {
                context: file.split('.')[0],
                content: readImage(Config.imageDir + '/' + file),
                timestamp: timestamp()
            }
        };

        const headers = {
            'x-auth-client': Config.apiToken,
            'x-signature': generateSignature(payload, Config.apiSecret),
            'content-type': 'application/json'
        };

        const options = { method: 'POST', headers: headers, body: JSON.stringify(payload) };
        const response = await fetch()(Config.apiUrl + '/sessions/' + verificationId + '/media', options);
        const json = await response.json();
        return response;
    }
    catch (err) {
        console.log('veriff upload function', err);
    }
}


const getMedia = async (verificationId) => {
    try {
        const headers = {
            'x-auth-client': Config.apiToken,
            'x-signature': generateSignature(verificationId, Config.apiSecret)
        };

        const options = { method: 'GET', headers: headers };
        const response = await fetch()(Config.apiUrl + '/sessions/' + verificationId + '/media', options);
        return await response.json();
    }
    catch (err) {
        console.log('Veriff getMedia function', err);
    }
}

async function end(verificationId) {
    try {
        const payload = { verification: { frontState: 'done', status: 'submitted', timestamp: timestamp() } };

        const headers = {
            'x-auth-client': Config.apiToken,
            'x-signature': generateSignature(payload, Config.apiSecret),
            'content-type': 'application/json'
        };

        const options = { method: 'PATCH', headers: headers, body: JSON.stringify(payload) };
        const response = await fetch()(Config.apiUrl + '/sessions/' + verificationId, options);
        return await response.json();
    }
    catch (err) {
        console.log('done method error', err);
    }
}

function timestamp() { return new Date().toISOString() };

function readImage(file) {
    const bitmap = fs.readFileSync(file);
    return Buffer.from(bitmap).toString('base64');
}


module.exports = {
    start,
    upload,
    getMedia,
    end
}