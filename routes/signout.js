let express = require('express')
let router = express.Router()

let checkLogin = require('../middlewares/check').checkLogin

// GET /signout 登录页
router.get('/', checkLogin, function (req, res) {
	req.session.user = null;			// 清空session中的用户信息
	req.flash('success', '登出成功');
	res.redirect(303, '/posts');
})

module.exports = router