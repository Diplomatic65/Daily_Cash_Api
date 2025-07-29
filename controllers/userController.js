const jwt = require("jsonwebtoken");
const transport = require("../middlewares/sendMail");
const { hmacProcess, doHash, doHashValidation } = require("../utils/hashing");
const User = require("../models/userModel");
const { userSignupSchema, userLoginSchema } = require("../middlewares/validator");

exports.signup = async (req, res) => {
    const { fullname, email, password, phone } = req.body;

    try {
        const { error } = userSignupSchema.validate({ fullname, email, password, phone });
        if (error) {
            return res.status(401).json({ success: false, message: error.details[0].message });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(401).json({ success: false, message: 'User already exists!' });
        }

        // Hash the password
        const hashedPassword = await doHash(password, 12);

        // Create new user
        const newUser = new User({
            fullname,
            email,
            password: hashedPassword,
            phone,
        });

        // Save user to the database
        const savedUser = await newUser.save();

        // Format the created and updated date/time for Somalia timezone (UTC+3)
        const createdAtObj = new Date(savedUser.createdAt);
        const updatedAtObj = new Date(savedUser.updatedAt);

        const createdDate = new Intl.DateTimeFormat('en-CA', {
            timeZone: 'Africa/Mogadishu'
        }).format(createdAtObj); // "YYYY-MM-DD"

        const createdTime = new Intl.DateTimeFormat('en-GB', {
            timeZone: 'Africa/Mogadishu',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        }).format(createdAtObj); // "HH:MM:SS"

        const updateDate = new Intl.DateTimeFormat('en-CA', {
            timeZone: 'Africa/Mogadishu'
        }).format(updatedAtObj); // "YYYY-MM-DD"

        const updateTime = new Intl.DateTimeFormat('en-GB', {
            timeZone: 'Africa/Mogadishu',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        }).format(updatedAtObj); // "HH:MM:SS"

        // Send response back with the new admin details including creation and update time
        res.status(201).json({
            success: true,
            message: "Your Account Has been Created",
            result: {
                _id: savedUser._id,
                fullname: savedUser.fullname,
                email: savedUser.email,
                phone: savedUser.phone,
                createdDate,
                createdTime,
                updateDate,
                updateTime
            }
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};



exports.login = async (req, res) => {
	const { email, password } = req.body;
	try {
		const { error, value } = userLoginSchema.validate({ email, password });
		if (error) {
			return res
				.status(401)
				.json({ success: false, message: error.details[0].message });
		}

		const existingUser = await User.findOne({ email }).select('+password');
		if (!existingUser) {
			return res
				.status(401)
				.json({ success: false, message: 'User does not exists!' });
		}
		const result = await doHashValidation(password, existingUser.password);
		if (!result) {
			return res
				.status(401)
				.json({ success: false, message: 'Invalid credentials!' });
		}
		const token = jwt.sign(
			{
				userId: existingUser._id,
				email: existingUser.email,
				fullname: existingUser.fullname,
				phone: existingUser.phone,
				verified: existingUser.verified,
			},
			process.env.TOKEN_SECRET,
            {
                expiresIn: '1d',
            }
			
		);

		res
			.cookie('Authorization', 'Bearer ' + token, {
				expires: new Date(Date.now() + 8 * 3600000),
				httpOnly: process.env.NODE_ENV === 'production',
				secure: process.env.NODE_ENV === 'production',
			})
			.json({
				success: true,
				token,
				message: 'Login successfully',
			});
	} catch (error) {
		console.log(error);
	}
};

exports.logout = async (req, res) => {
	res
		.clearCookie('Authorization')
		.status(200)
		.json({ success: true, message: 'logged out successfully' });
};


exports.getUser = async (req, res) => {
    try {
        const users = await User.find();  // Fetch all users

        // Format the date and time for each user
        const formattedUsers = users.map(user => {
            const createdAtObj = new Date(user.createdAt);
            const updatedAtObj = new Date(user.updatedAt);

            // Format createdAt date and time
            const createdDate = new Intl.DateTimeFormat('en-CA', {
                timeZone: 'Africa/Mogadishu',
            }).format(createdAtObj); // "YYYY-MM-DD"

            const createdTime = new Intl.DateTimeFormat('en-GB', {
                timeZone: 'Africa/Mogadishu',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false,
            }).format(createdAtObj); // "HH:MM:SS"

            // Format updatedAt date and time
            const updateDate = new Intl.DateTimeFormat('en-CA', {
                timeZone: 'Africa/Mogadishu',
            }).format(updatedAtObj); // "YYYY-MM-DD"

            const updateTime = new Intl.DateTimeFormat('en-GB', {
                timeZone: 'Africa/Mogadishu',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false,
            }).format(updatedAtObj); // "HH:MM:SS"

            return {

                userId: user._id,
                fullname: user.fullname,
                email: user.email,
                phone: user.phone,
                createdDate,
                createdTime,
                updateDate,
                updateTime,
            };
        });

        res.status(200).json({
            success: true,
            message: 'Users fetched successfully',
            data: formattedUsers,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Error fetching admins' });
    }
};




exports.updateUser = async (req, res) => {
    const { fullname, email, password, phone } = req.body;
    const userId = req.params.id;  // Get the user ID from the route parameter

    try {
        // Find the user by ID
        const existingUser = await User.findById(userId);
        if (!existingUser) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Update user details
        if (fullname) existingUser.fullname = fullname;
        if (email) existingUser.email = email;
        if (password) existingUser.password = await doHash(password, 12);
        if (phone) existingUser.phone = phone;

        // Save the updated user
        const updatedUser = await existingUser.save();

        // Format the updated date and time for Somalia timezone (UTC+3)
        const updatedAtObj = new Date(updatedUser.updatedAt);

        const updateDate = new Intl.DateTimeFormat('en-CA', {
            timeZone: 'Africa/Mogadishu',
        }).format(updatedAtObj); // "YYYY-MM-DD"

        const updateTime = new Intl.DateTimeFormat('en-GB', {
            timeZone: 'Africa/Mogadishu',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
        }).format(updatedAtObj); // "HH:MM:SS"

        res.status(200).json({
            success: true,
            message: 'User updated successfully',
            result: {
                _id: updatedUser._id,
                fullname: updatedUser.fullname,
                email: updatedUser.email,
                phone: updatedUser.phone,
                updateDate,
                updateTime,
            },
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Error updating admin' });
    }
};

exports.deleteUser = async (req, res) => {
    const userId = req.params.id;  // Get the 'id' from the URL parameter

    try {
        // Find the user by ID and delete it
        const result = await User.findByIdAndDelete(userId);

        if (!result) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({
            success: true,
            message: 'User deleted successfully',
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Error deleting user' });
    }
};