
const API_TOKEN = process.env.API_TOKEN;
const API_SECRET = process.env.API_SECRET;
const API_URL = process.env.API_URL;
const IMAGE_DIR = process.env.IMAGE_DIR;

// TODO: Server environment keys validation and error configurations.

module.exports = {
    apiToken: API_TOKEN,
    apiSecret: API_SECRET,
    apiUrl: API_URL,
    imageDir: IMAGE_DIR
}