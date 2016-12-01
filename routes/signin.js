let express = require('express')
let router = express.Router()

let checkNotLogin = require('../middlewares/check').checkNotLogin

// GET /signin 登录页
router.get('/', checkNotLogin, function (req, res) {
	res.send(req.flash())
})
// POST /signin 用户登录
router.post('/', checkNotLogin, function (req, res) {
	res.send(req.flash())
})

module.exports = router