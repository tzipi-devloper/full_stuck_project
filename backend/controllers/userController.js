
const User = require('../models/users')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const userSchema = require('../schemas/userSchema');

exports.addUser = async (req, res) => {
  try {
    const validationResult = userSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({ message: validationResult.error.errors });
    }

    const { _id, name, password, email, phone } = validationResult.data;
    const foundUser = await User.findOne({ email }).lean();
    if (foundUser) {
      return res.status(401).json({ message: 'המייל קיים על משתמש אחר' });
    }

    const hashedPwd = await bcrypt.hash(password, 10);
    const userObject = { _id, name, email, phone, password: hashedPwd };
    const user = await User.create(userObject);

    if (user) {
      const userInfo = {
        name: user.name,
        email: user.email,
        _id: user._id,
      };

      const token = jwt.sign(userInfo, process.env.ACCESS_TOKEN_SECRET);
      console.log('Generated Access Token:', token);
      return res.status(200).json({ token, message: 'User created successfully' });

    } else {
      return res.status(400).json({ message: 'Invalid user received' });
    }

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
