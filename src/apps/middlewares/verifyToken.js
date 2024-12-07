const jwt = require('jsonwebtoken');
const asyncHandle = require('express-async-handler');

const verifyAccessToken = asyncHandle(async (req, res, next) => {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
            if (err) {
                return res
                    .status(401)
                    .json({
                        success: false,
                        mes: 'Invalid AccessToken'
                    })
            }
            req.user = decode;
            next();
        });
    } else {
        return res
            .status(401)
            .json({
                success: false,
                mes: 'Not found Accesstoken'
            })
    }
})

//Check admin
const isAdmin = asyncHandle(async (req, res, next) => {
    const { role } = req.user;
    if (role !== 'admin') {
        return res
            .status(401)
            .json({
                status: false,
                mes: 'Require Admin role'
            })
    }
    next();
})

module.exports = {
    verifyAccessToken,
    isAdmin
}