const router = require('express').Router()
const UserCtrl = require('../controllers/userCtrl')
const auth = require('../middleware/auth')

router.post('/register', UserCtrl.register)
router.post('/login', UserCtrl.login)
router.get('/logout', UserCtrl.logout)
router.get('/refresh_token', UserCtrl.refreshToken)
router.get('/infor', auth, UserCtrl.getUser)
router.patch('/addcart', auth, UserCtrl.addCart)
router.get('/history', auth, UserCtrl.history)

module.exports = router