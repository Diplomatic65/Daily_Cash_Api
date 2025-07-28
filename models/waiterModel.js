const mongoose = require('mongoose');

const waiterSchema = mongoose.Schema({
	fullname: {
		type: String,
		required: [true, 'Full Name is required!'],
		trim: true,
		minLength: [3, 'Full Name must have at least 3 characters!'],
	},
	email: {
		type: String,
		required: [true, 'Email is required!'],
		trim: true,
		unique: [true, 'Email must be unique!'],
		minLength: [5, 'Email must have 5 characters!'],
		lowercase: true,
	},
	password: {
		type: String,
		required: [true, 'Password must be provided!'],
		trim: true,
		select: false,
	},
	phone: {
		type: String,
		required: [true, 'Phone number is required!'],
		unique: true,
		match: [/^\d+$/, 'Phone number must contain only numbers!'],
		minLength: [7, 'Phone number must be at least 7 digits!'],
		maxLength: [15, 'Phone number cannot be more than 15 digits!'],
	},
}, { timestamps: true });

const Waiter = mongoose.model('Waiter', waiterSchema);

module.exports = Waiter;
