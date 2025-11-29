const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer')) {
        return res.status(401).json({ msg: 'No token, Authorization denied' });
    }

    const token = authHeader.spilt('')[1];
    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decode.user;
        next();
    }
    catch (err) {
        res.status(401).json({ msg: 'Token Invalid' })
    }
}