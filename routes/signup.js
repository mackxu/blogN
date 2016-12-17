let fs = require('fs')
let path = require('path')
let express = require('express')
let router = express.Router()

let UserModel = require('../models/users')
let checkNotLogin = require('../middlewares/check').checkNotLogin

// GET /signup 注册页
router.get('/', checkNotLogin, function (req, res) {
	res.render('signup', {title: '注册'})
})
// POST /signin 用户注册
router.post('/', checkNotLogin, function (req, res, next) {

	let { name, passwd, repasswd, gender, bio } = req.fields;
	let avatar = req.files.avatar.path.split(path.sep).pop();

	// 参数校验
	try {
		if(!(name.length > 0 && name.length <= 10)) throw new Error('名字请限制在1-10个字符');
		if(passwd !== repasswd) throw new Error('两次输入的密码不一致');
	} catch (e) {
		fs.unlink(req.fields.avatar.path);
		req.flash('error', e.message);
		return res.redirect(303, '/signup');
	}
	// 密码加密

	UserModel.create({
		name: name,
		passwd: passwd,
		gender: gender,
		bio: bio,
		avatar: avatar
	}).then(result => {
		let user = result.ops[0];
		delete user.passwd
		req.session.user = user
		req.flash('success', '注册成功')
		res.redirect(303, '/posts')
	}).catch(e => {
		fs.unlink(req.fields.avatar.path);		// 注册失败,异步删除上传的头像
		if(e.message.match('E11000 duplicate key')) {
			req.flash('error', '用户名被占用')
			return res.redirect(303, '/signup')
		}
		next(e)
	})
})

module.exports = router