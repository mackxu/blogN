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
		console.log('create user:');
		console.log(user);
		req.flash('success', '注册成功')
		res.redirect('/posts')
	}).catch(e => {
		if(e.message.match('E11000 duplicate key')) {
			req.flash('error', '用户名被占用')
			return res.redirect('/signup')
		}
		next()
	})
	req.flash('success', '注册成功')
	return res.redirect(303, '/posts')
})

module.exports = router