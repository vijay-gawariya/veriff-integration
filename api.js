const { Router } = require("express");
const route = Router();
const Config = require("./config");
const Verrif = require("./veriff");

route.post('/verify', async (req, res, next) => {
    try {
        const files = fs.readdirSync('./' + Config.imageDir).filter(file => file.match(/.*\.(jpg|jpeg|png)/ig));
        const session = await start();
        const verificationId = session.verification.id;
        console.log('Started verification with an id of', verificationId);

        const uploads = files.map(async (file) => {
            await upload(verificationId, file);
            console.log('Uploaded file', file);
        });

        await Promise.all(uploads).then(async () => {
            await end(verificationId);
            console.log('Ended verification');

            console.log('Getting media for the verification session');
            const media = await getMedia(verificationId);
            console.log(JSON.stringify(media, null, 4));
        });

        return res.status(200).json({ message: "Information verified successfully." })
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server Error", error: err })
    }
});


module.exports = route;