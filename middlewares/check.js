module.exports = {
	checkLogin(req, res, next) {
		req.flash('error', 'not login')
		return res.redirect('/signin')
		next()
	},
	checkNotLogin(req, res, next) {
		// req.flash('error', 'user logined')
		// return res.redirect('/posts')
		next()
	}
};