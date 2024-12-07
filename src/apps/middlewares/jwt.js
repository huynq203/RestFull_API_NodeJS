const jwt = require('jsonwebtoken');

//khoi tao token
const AccessToken = (uid, role) => {
    return jwt.sign({ _id: uid, role }, process.env.JWT_SECRET, { expiresIn: '3d' });
}

//Reset Token
const RefreshToken = (uid) => {
    return jwt.sign({ _id: uid }, process.env.JWT_SECRET, { expiresIn: '7d' });
}


module.exports = {
    AccessToken,
    RefreshToken
}