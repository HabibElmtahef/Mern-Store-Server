const router = require('express').Router()
const authAdmin = require('../middleware/authAdmin')
const auth = require('../middleware/auth')
const CategoryCtrl = require('../controllers/categoryCtrl')

router.get('/', CategoryCtrl.getCategories)
router.post('/add', auth, authAdmin, CategoryCtrl.addCategory)
router.put('/update/:id', auth, authAdmin, CategoryCtrl.updateCategory)

module.exports = router