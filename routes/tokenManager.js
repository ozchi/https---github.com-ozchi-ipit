const crypto = require('crypto');

const tokensStore = {};

function generateToken() {
    return crypto.randomBytes(48).toString('hex');
}

function storeToken(token, user_id) {
    tokensStore[token] = user_id;
}

function verifyToken(token) {
    return tokensStore[token];
}

module.exports = {
    generateToken,
    storeToken,
    verifyToken
};