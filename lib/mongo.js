let config = require('config-lite')
let moment = require('moment')
let objectIdToTimestamp = require('objectid-to-timestamp')
let Mongolass = require('mongolass')
let mongolass = new Mongolass()

mongolass.connect(config.mongodb)

mongolass.plugin('addCreateAt', {
	afterFind(results) {
		return results.forEach(item => {
			item.created_at = moment(objectIdToTimestamp(item._id)).format('YYYY-MM-DD HH:mm')
		})
	},
	afterFindOne(result) {
		if(!result) return result;
		result.created_at = moment(objectIdToTimestamp(result._id)).format('YYYY-MM-DD HH:mm')
		return result;
	}
})

exports.User = mongolass.model('User', {
	name: {
		type: 'string'
	}, passwd: {
		type: 'string'
	}, avatar: {
		type: 'string'
	}, gender: {
		type: 'string',
		enum: ['m', 'f']
	}, bio: {
		type: 'string'
	}
})
// 根据用户名找到用户, 用户名全局唯一
exports.User.index({ name: 1 }, { unique: true }).exec();

