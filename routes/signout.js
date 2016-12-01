let express = require('express')
let router = express.Router()

let checkLogin = require('../middlewares/check').checkLogin

// GET /signout 登录页
router.get('/', checkLogin, function (req, res) {
	res.send(req.flash())
})

module.exports = router