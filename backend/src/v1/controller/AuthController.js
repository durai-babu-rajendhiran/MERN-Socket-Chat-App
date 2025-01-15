const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../model/User"); 

exports.Login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ status: false, msg: "User not found" });
        }
        // Compare the password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ status: false, msg: "Invalid credentials" });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
        return res.json({ status: true, token, msg: "Login successful" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, msg: "Internal server error" });
    }
};

exports.Register = async (req, res) => {
    try {
        const { email, password, full_name } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ status: false, msg: "Email already in use" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await new User({ email, password: hashedPassword, full_name }).save();

        return res.json({ status: true, data: user, msg: "Registration successful" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, msg: "Internal server error" });
    }
};

exports.UserList = async (req, res) => {
    try {
        console.log(req.user);
        const userData = await User.find({ _id: { $ne: req.user.id } }).exec();
        return res.json({ status: true, data: userData, msg: "Users fetched successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, msg: "Internal server error" });
    }
}

exports.UserGet = async (req, res) => {
    try {
        console.log(req.user);
        const userData = await User.findById(req.user.id).exec();
        return res.json({ status: true, data: userData, msg: "User fetched successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, msg: "Internal server error" });
    }
}