const User = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.signIn = async (req, res) => {
    console.log('SignIn request received:', req.body);
    const { email, password } = req.body;

    try {
        const foundUser = await User.findOne({ email }).lean();

        if (!foundUser) {
            return res.status(400).json({ message: "User not found" });
        }

        const match = await bcrypt.compare(password, foundUser.password);
        if (!match) {
            return res.status(401).json({ message: 'הסיסמא לא תואמת' });
        }

        const userInfo = {
            name: "name",
            email: foundUser.email,
            _id: foundUser._id
        };
        console.log(foundUser);
        
        console.log(userInfo.name);
        console.log(userInfo.email);        
        console.log(userInfo._id);        
        const token = jwt.sign(userInfo, process.env.ACCESS_TOKEN_SECRET);
        console.log('Generated Access Token:', token);
        return res.status(200).json({ token, message: 'User signed in successfully' });

    } catch (error) {
        console.error('Error signing in:', error);
        res.status(500).json({ message: "Internal server error" });
    }
};

