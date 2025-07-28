const jwt = require("jsonwebtoken");
const { hmacProcess, doHash, doHashValidation } = require("../utils/hashing");
const Waiter = require("../models/waiterModel");
const { waiterSignupSchema, waiterLoginSchema } = require("../middlewares/validator");

exports.signup = async (req, res) => {
	const { fullname, email, password, phone } = req.body;
	try {
		const { error } = waiterSignupSchema.validate({ fullname, email, password, phone });
		if (error) return res.status(401).json({ success: false, message: error.details[0].message });

		const existingWaiter = await Waiter.findOne({ email });
		if (existingWaiter) return res.status(401).json({ success: false, message: 'Waiter already exists!' });

		const hashedPassword = await doHash(password, 12);
		const newWaiter = new Waiter({ fullname, email, password: hashedPassword, phone });
		const savedWaiter = await newWaiter.save();

		const createdAtObj = new Date(savedWaiter.createdAt);
		const updatedAtObj = new Date(savedWaiter.updatedAt);

		const createdDate = new Intl.DateTimeFormat('en-CA', { timeZone: 'Africa/Mogadishu' }).format(createdAtObj);
		const createdTime = new Intl.DateTimeFormat('en-GB', {
			timeZone: 'Africa/Mogadishu',
			hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
		}).format(createdAtObj);

		const updateDate = new Intl.DateTimeFormat('en-CA', { timeZone: 'Africa/Mogadishu' }).format(updatedAtObj);
		const updateTime = new Intl.DateTimeFormat('en-GB', {
			timeZone: 'Africa/Mogadishu',
			hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
		}).format(updatedAtObj);

		res.status(201).json({
			success: true,
			message: "Your Account Has been Created",
			result: {
				_id: savedWaiter._id,
				fullname,
				email,
				phone,
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
		const { error } = waiterLoginSchema.validate({ email, password });
		if (error) return res.status(401).json({ success: false, message: error.details[0].message });

		const existingWaiter = await Waiter.findOne({ email }).select('+password');
		if (!existingWaiter) return res.status(401).json({ success: false, message: 'Waiter does not exist!' });

		const result = await doHashValidation(password, existingWaiter.password);
		if (!result) return res.status(401).json({ success: false, message: 'Invalid credentials!' });

		const token = jwt.sign({
			userId: existingWaiter._id,
			email: existingWaiter.email,
			fullname: existingWaiter.fullname,
			phone: existingWaiter.phone,
		}, process.env.TOKEN_SECRET, { expiresIn: '1d' });

		res.cookie('Authorization', 'Bearer ' + token, {
			expires: new Date(Date.now() + 8 * 3600000),
			httpOnly: process.env.NODE_ENV === 'production',
			secure: process.env.NODE_ENV === 'production',
		}).json({ success: true, token, message: 'Login successfully' });
	} catch (error) {
		console.log(error);
		res.status(500).json({ success: false, message: "Internal server error" });
	}
};

exports.logout = async (req, res) => {
	res.clearCookie('Authorization').status(200).json({ success: true, message: 'Logged out successfully' });
};

exports.getWaiters = async (req, res) => {
	try {
		const waiters = await Waiter.find();
		const formattedWaiters = waiters.map(waiter => {
			const createdAtObj = new Date(waiter.createdAt);
			const updatedAtObj = new Date(waiter.updatedAt);

			const createdDate = new Intl.DateTimeFormat('en-CA', { timeZone: 'Africa/Mogadishu' }).format(createdAtObj);
			const createdTime = new Intl.DateTimeFormat('en-GB', {
				timeZone: 'Africa/Mogadishu',
				hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
			}).format(createdAtObj);

			const updateDate = new Intl.DateTimeFormat('en-CA', { timeZone: 'Africa/Mogadishu' }).format(updatedAtObj);
			const updateTime = new Intl.DateTimeFormat('en-GB', {
				timeZone: 'Africa/Mogadishu',
				hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
			}).format(updatedAtObj);

			return {
				userId: waiter._id,
				fullname: waiter.fullname,
				email: waiter.email,
				phone: waiter.phone,
				createdDate,
				createdTime,
				updateDate,
				updateTime
			};
		});

		res.status(200).json({ success: true, message: 'Waiters fetched successfully', data: formattedWaiters });
	} catch (err) {
		console.log(err);
		res.status(500).json({ success: false, message: 'Error fetching waiters' });
	}
};

exports.updateWaiter = async (req, res) => {
	const { fullname, email, password, phone } = req.body;
	const waiterId = req.params.id;

	try {
		const existingWaiter = await Waiter.findById(waiterId);
		if (!existingWaiter) return res.status(404).json({ success: false, message: 'Waiter not found' });

		if (fullname) existingWaiter.fullname = fullname;
		if (email) existingWaiter.email = email;
		if (password) existingWaiter.password = await doHash(password, 12);
		if (phone) existingWaiter.phone = phone;

		const updatedWaiter = await existingWaiter.save();

		const updatedAtObj = new Date(updatedWaiter.updatedAt);
		const updateDate = new Intl.DateTimeFormat('en-CA', { timeZone: 'Africa/Mogadishu' }).format(updatedAtObj);
		const updateTime = new Intl.DateTimeFormat('en-GB', {
			timeZone: 'Africa/Mogadishu',
			hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
		}).format(updatedAtObj);

		res.status(200).json({
			success: true,
			message: 'Waiter updated successfully',
			result: {
				_id: updatedWaiter._id,
				fullname: updatedWaiter.fullname,
				email: updatedWaiter.email,
				phone: updatedWaiter.phone,
				updateDate,
				updateTime
			}
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({ success: false, message: 'Error updating waiter' });
	}
};

exports.deleteWaiter = async (req, res) => {
	const waiterId = req.params.id;
	try {
		const result = await Waiter.findByIdAndDelete(waiterId);
		if (!result) return res.status(404).json({ success: false, message: 'Waiter not found' });

		res.status(200).json({ success: true, message: 'Waiter deleted successfully' });
	} catch (err) {
		console.log(err);
		res.status(500).json({ success: false, message: 'Error deleting waiter' });
	}
};
