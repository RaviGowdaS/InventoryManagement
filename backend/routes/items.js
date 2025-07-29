const express = require('express');
const {
  getItems,
  getItem,
  createItem,
  updateItem,
  deleteItem,
  getCategories
} = require('../controllers/itemController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, getItems);
router.get('/categories', auth, getCategories);
router.get('/:id', auth, getItem);
router.post('/', auth, createItem);
router.put('/:id', auth, updateItem);
router.delete('/:id', auth, deleteItem);

module.exports = router;