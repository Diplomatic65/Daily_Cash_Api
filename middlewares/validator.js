const joi = require('joi');

exports.waiterSignupSchema = joi.object({
	fullname: joi.string().min(3).max(100).required(),
	phone: joi.string().pattern(/^[0-9]{9,15}$/).required(),
	email: joi.string().min(6).max(60).required().email({ tlds: { allow: ['com', 'net'] } }),
	password: joi.string().min(6).max(100).required().pattern(/^[0-9]{6,100}$/)
});

exports.waiterLoginSchema = joi.object({
	email: joi.string().min(6).max(60).required().email({ tlds: { allow: ['com', 'net'] } }),
	password: joi.string().required().pattern(/^[0-9]{6,100}$/)
});

exports.transactionSchema = joi.object({
	waiter: joi.string().required(),
	merchant: joi.number().required(),
	premier: joi.number().required(),
	edahab: joi.number().required(),
	"e-besa": joi.number().required(),
	others: joi.number().required(),
	credit: joi.number().required(),
	promotion: joi.number().required()
});
