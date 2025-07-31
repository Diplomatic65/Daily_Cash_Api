const express = require('express');
const transactionController = require('../controllers/transactionController');
const router = express.Router();
router.post('/create-transaction', transactionController.createTransaction);
router.get('/all-transactions', transactionController.getTransaction);
// router.put('/update-waiter/:id', waiterController.updateWaiter);
// router.delete('/delete-waiter/:id', waiterController.deleteWaiter);
module.exports = router;