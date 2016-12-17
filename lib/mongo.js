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

exports.Post = mongolass.model('Post', {
	author: {
		type: Mongolass.Types.ObjectId
	},
	title: {
		type: 'string'
	},
	content: {
		type: 'string'
	},
	pv: {
		type: 'number'
	}
});

// 按创建时间的降序查看用户的文章列表
exports.Post.index({ author: 1, _id: -1 }).exec();

exports.Comment = mongolass.model('Comment', {
	author: { type: Mongolass.Types.ObjectId },
	content: { type: 'string' },
	postId: { type: Mongolass.Types.ObjectId }
});

// 通过文章id获取该文章下所有留言,按创建时间升序展示
exports.Comment.index({ postId: 1, _id: 1 }).exec();
// 通过用户id和留言id删除一个留言
exports.Comment.index({ author: 1, _id: 1 }).exec();
