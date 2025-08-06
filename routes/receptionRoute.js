const express = require('express');
const receptionController = require('../controllers/receptionController');
const router = express.Router();
router.post('/create-reception', receptionController.createReception);
// router.get('/all-receptions', receptionController.getReception);
// router.put('/update-reception/:id', receptionController.updateReception);
// router.delete('/delete-reception/:id', receptionController.deleteReception);
module.exports = router;