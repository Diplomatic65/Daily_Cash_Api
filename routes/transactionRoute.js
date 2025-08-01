const express = require('express');
const transactionController = require('../controllers/transactionController');
const router = express.Router();
router.post('/create-transaction', transactionController.createTransaction);
router.get('/all-transactions', transactionController.getTransaction);
router.put('/update-transaction/:id', transactionController.updateTransaction);
router.delete('/delete-transaction/:id', transactionController.deleteTransaction);
module.exports = router;