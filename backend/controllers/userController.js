const User = require('../models/users');
const userSchema = require('../schemas/userSchema');

exports.addUser = async (req, res) => {
    try {
        const validationResult = userSchema.safeParse(req.body);

        if (!validationResult.success) {
            return res.status(400).json({ message: validationResult.error.errors });
        }

        const { name, password, email, phone } = validationResult.data;
        const foundUser = await User.findOne({ email }).lean();
        if (foundUser) {
            return res.status(401).json({ message: 'המייל קיים על משתמש אחר' });
        }

        const user = await User.create({ name, password, email, phone });

        if (user) {
            return res.status(200).json({ message: 'User created successfully' });
        } else {
            return res.status(400).json({ message: 'Invalid user received' });
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
