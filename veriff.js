// TODO: 1. common count all request's with secret key

const crypto = require("crypto");
const request = require("request-promise");
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
        if (!person)
            throw new Error("Person details are required.")
        else if (!document)
            throw new Error("Document details are required.")
        const payload = {
            verification: {
                person, document, lang: 'en',
                features: ['selfid'],
                timestamp: timestamp()
            }
        };

        const options = {
            method: 'POST',
            uri: Config.apiUrl + '/sessions/',
            headers: {
                'x-auth-client': Config.apiToken,
                'x-signature': generateSignature(payload, Config.apiSecret),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload),
            json: true,
        };
        console.log(`options:${JSON.stringify(options)}`);
        return request(options);
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

        const options = {
            method: 'POST',
            uri: Config.apiUrl + '/sessions/' + verificationId + '/media',
            headers: {
                'x-auth-client': Config.apiToken,
                'x-signature': generateSignature(payload, Config.apiSecret),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload),
            json: true,
        };
        console.log(`options:${JSON.stringify(options)}`);
        return request(options);
    }
    catch (err) {
        console.log('veriff upload function', err);
    }
}


const getMedia = async (verificationId) => {
    try {
        const options = {
            method: 'GET',
            uri: Config.apiUrl + '/sessions/' + verificationId + '/media',
            headers: {
                'x-auth-client': Config.apiToken,
                'x-signature': generateSignature(verificationId, Config.apiSecret),
                'Content-Type': 'application/json'
            },
            json: true,
        };
        console.log(`options:${JSON.stringify(options)}`);
        return request(options);
    }
    catch (err) {
        console.log('Veriff getMedia function', err);
    }
}

const getProofOfAddress = async (verificationId) => {
    try {
        const options = {
            method: 'GET',
            uri: Config.apiUrl + '/attempts/' + verificationId + '/proof-of-address',
            headers: {
                'x-auth-client': Config.apiToken,
                'x-signature': generateSignature(verificationId, Config.apiSecret),
                'Content-Type': 'application/json'
            },
            json: true,
        };
        console.log(`options:${JSON.stringify(options)}`);
        return request(options);
    }
    catch (err) {
        console.log('Veriff getProofOfAddress function', err);
    }
}

async function end(verificationId) {
    try {
        const payload = { verification: { frontState: 'done', status: 'submitted', timestamp: timestamp() } };

        const options = {
            method: 'PATCH',
            uri: Config.apiUrl + '/sessions/' + verificationId,
            headers: {
                'x-auth-client': Config.apiToken,
                'x-signature': generateSignature(payload, Config.apiSecret),
                'Content-Type': 'application/json'
            },
            json: true,
        };
        console.log(`options:${JSON.stringify(options)}`);
        return request(options);
    } catch (err) {
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
    getProofOfAddress,
    end
}