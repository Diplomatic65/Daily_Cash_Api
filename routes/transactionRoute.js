const express = require('express');
const transactionController = require('../controllers/transactionController');
const router = express.Router();
router.post('/create-transaction', transactionController.createTransaction);
// router.post('/login', waiterController.login);
// router.post('/logout', waiterController.logout);


// router.get('/all-waiters', waiterController.getWaiters);
// router.put('/update-waiter/:id', waiterController.updateWaiter);
// router.delete('/delete-waiter/:id', waiterController.deleteWaiter);
module.exports = router;