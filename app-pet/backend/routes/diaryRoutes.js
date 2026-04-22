const express = require('express');
const router = express.Router();
const diaryController = require('../controllers/diaryController');

router.get('/', diaryController.listEntries);
router.get('/:id', diaryController.getEntryById);
router.post('/', diaryController.createEntry);
router.put('/:id', diaryController.updateEntry);
router.delete('/:id', diaryController.deleteEntry);

module.exports = router;
