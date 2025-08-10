const joi = require('joi');
const mongoose = require('mongoose'); // If not used, you can remove this

const userSignupSchema = joi.object({
  fullname: joi.string()
    .min(3)
    .max(100)
    .required(),

  phone: joi.string()
    .pattern(/^[0-9]{9,15}$/)
    .required(),

  email: joi.string()
    .min(6)
    .max(60)
    .required()
    .email({ tlds: { allow: ['com', 'net'] } }),

  // Password: only numbers allowed
  password: joi.string()
    .min(6)
    .max(100)
    .required()
    .pattern(new RegExp('^[0-9]{6,100}$')) // Only numeric characters
});

const userLoginSchema = joi.object({
  email: joi.string()
    .min(6)
    .max(60)
    .required()
    .email({ tlds: { allow: ['com', 'net'] } }),

  // Password: only numbers allowed
  password: joi.string()
    .required()
    .pattern(new RegExp('^[0-9]{6,100}$')) // Only numeric characters
});


const transactionSchema = joi.object({
  waiter: joi.string().required(),
  merchant: joi.number().required(),
  premier: joi.number().required(),
  edahab: joi.number().required(),
  "e-besa": joi.number().required(),
  others: joi.number().required(),
  credit: joi.number().required(),
  promotion: joi.number().required(),
  open: joi.number().required()
});


const receptionSchema = joi.object({
  receptionname: joi.string().required(),
  merchant: joi.number().required(),
  Evc: joi.number().required(),
  premier: joi.number().required(),
  edahab: joi.number().required(),
  "e-besa": joi.number().required(),
  others: joi.number().required(),
  credit: joi.number().required(),
  deposit: joi.number().required(),
  refund: joi.number().required(),
  discount: joi.number().required(),
});


module.exports = {
  userSignupSchema,
  userLoginSchema,
  transactionSchema,
  receptionSchema
};