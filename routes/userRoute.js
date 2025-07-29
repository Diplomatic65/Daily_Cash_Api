const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();
router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.post('/logout', userController.logout);


router.get('/all-users', userController.getUser);
// router.put('/update-user/:id', userController.updateUser);
// router.delete('/delete-user/:id', userController.deleteUser);
module.exports = router;