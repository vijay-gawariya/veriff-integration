const { Router } = require("express");
const crypto = require('crypto');

const route = Router();
const Config = require("./config");

const isSignatureValid = (data) => {
    const { signature, secret } = data;
    let { payload } = data;
    if (data.payload.constructor === Object)
        payload = JSON.stringify(data.payload);
    if (payload.constructor !== Buffer)
        payload = new Buffer.from(payload, 'utf8');
    const hash = crypto.createHash('sha256');
    hash.update(payload);
    hash.update(new Buffer.from(secret));
    const digest = hash.digest('hex');
    return digest === signature.toLowerCase();
}


route.post('/verification', (req, res, next) => {
    console.log('Webhook First Log');
    const signature = req.get('x-signature');
    const secret = Config.apiSecret;
    const payload = req.body;
    console.log('Payload', JSON.stringify(payload, null, 4));
    console.log('Validated signature:', isSignatureValid({ signature, secret, payload }));

    res.json({ status: 'success' });
    process.exit();
})

module.exports = route;