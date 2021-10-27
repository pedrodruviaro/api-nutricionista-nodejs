const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader)
        return res.status(400).json({ error: "Token not provided" });

    const parts = authHeader.split(" ");

    if (parts.length !== 2)
        return res.status(400).json({ error: "Token error" });

    const [bearer, token] = parts;

    if (!/^Bearer$/i.test(bearer))
        return res.status(400).json({ error: "Token error" });

    jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
        if (err) return res.status(400).json({ error: "Invalid token" });

        req.user = decoded;
        next();
    });
};
