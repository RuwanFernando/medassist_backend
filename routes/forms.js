const express = require('express');
const router = express.Router();
const formController = require('../controllers/formController');
const { setupMulter } = require('../utils/helper');
const auth = require('../middlewares/auth');

const itemsUpload = setupMulter('uploads');

router.post('/form-submission', auth.verifyJWT, auth.checkRole(['seafarer']), itemsUpload.single('file'), formController.formSubmission);

module.exports = router;