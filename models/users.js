let User = require('../lib/mongo').User

module.exports = {
	create(user) {
		return User.create(user).exec()
	},
	getUserByName(name) {			// 通过用户名获取用户信息
		"use strict";
		return User
			.findOne({ name })
			.addCreateAt()
			.exec();
	}
}