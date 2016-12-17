module.exports = {
	checkLogin(req, res, next) {
		if(!req.session.user) {
			req.flash('error', '请先登录');
			return res.redirect(303, '/signin')
		}
		next();
	},
	checkNotLogin(req, res, next) {
		if(req.session.user) {
			req.flash('error', '你已登录')
			return res.redirect(303, '/posts')
		}
		next();
	}
};