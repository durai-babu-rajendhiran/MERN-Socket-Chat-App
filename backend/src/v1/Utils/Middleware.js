const jwt = require("jsonwebtoken");

exports.authMiddleware = (req, res, next) => {
    try {
        const token = req.header("Authorization").replace("Bearer ", "");
        if (!token) {
            return res.status(401).json({ status: false, msg: "Access denied" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach user data to the request
        next();
    } catch (err) {
        console.error(err);
        return res.status(401).json({ status: false, msg: "Invalid token" });
    }
};
