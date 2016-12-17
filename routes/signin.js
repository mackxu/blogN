let express = require('express')
let router = express.Router()

let UserModel = require('../models/users')
let checkNotLogin = require('../middlewares/check').checkNotLogin

// GET /signin 登录页
router.get('/', checkNotLogin, function (req, res) {
	res.render('signin', {
		title: '登录'
	})
})
// POST /signin 用户登录
router.post('/', checkNotLogin, function (req, res, next) {
	let { name, passwd } = req.fields;
	console.log(name);
	UserModel.getUserByName(name)
		.then(user => {
			"use strict";
			if (!user) {
				req.flash('error', 'user is not exist');
				// 重定向到请求的referer，当没有referer请求头的情况下，默认为‘/’
				return res.redirect('back')
			}
			// 检查密码是否匹配

			req.flash('success', 'login success');
			delete user.passwd;
			req.session.user = user;
			res.redirect('/posts')
		})
		.catch(next)
})

module.exports = router