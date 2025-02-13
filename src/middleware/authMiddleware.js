const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const token = req.cookies.token;
    if(!token) return res.status(401).json({ msg: "Akses ditolak, tidak ada token"});

    try{
        const decode = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
        req.user = decode.userId;
        next();
    } catch (err) {
        res.status(401).json({ msg: "Token tidak valid"});
    }
}