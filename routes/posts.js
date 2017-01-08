let express = require('express')
let router = express.Router()

let PostModel = require('../models/posts')
let checkLogin = require('../middlewares/check').checkLogin

// GET /posts所有用户或者特定用户的文章页
// eg: GET /posts?author=xxx
router.get('/', function (req, res, next) {
	PostModel.fetchPosts(req.query.author)
		.then(posts => {
			res.render('posts', { title: "主页", posts: posts })
		})
		.catch(next);
});

// POST /posts 发表一篇文章
router.post('/', checkLogin, function (req, res, next) {
	let author = req.session.user._id;
	let { title, content } = req.fields;

	PostModel.create({ author, title, content })
		.then(result => {
			"use strict";
			let post = result.ops[0];
			req.flash('success', '发布成功');
			res.redirect(`/posts/${post._id}`);
		})
		.catch(next)
});

// GET /posts/create 发表文章页
router.get('/create', checkLogin, function (req, res, next) {
	res.render('post-create', {
		title: '发布一篇文章'
	})
});

// GET /posts/:postId 文章详情页
router.get('/:postId', function(req, res, next) {
	let postId = req.params.postId;

	Promise.all([
		PostModel.fetchPostById(postId),
		PostModel.incPv(postId)
	]).then(result => {
		"use strict";
		var post = result[0];
		if(!post) throw new Error('该文章不存在');
		res.render('post', {
			title: '一篇文章',
			post
		})
	}).catch(next);
});

// GET /posts/:postId/edit 更新文章页
router.get('/:postId/edit', checkLogin, function(req, res, next) {
	var postId = req.params.postId;
	var author = req.session.user._id;

	PostModel.fetchRawPostById(postId)
		.then(post => {
			if(!post) {
				throw new Error('该文章不存在');
			}
			if(author.toString() !== post.author._id.toString()) {
				throw new Error('权限不够');
			}
			res.render('post-edit', {
				title: `更新文章${post.title}`,
				post: post
			})
		})
		.catch(next);
});

// POST /posts/:postId/edit 更新文章
router.post('/:postId/edit', checkLogin, function(req, res, next) {
	var postId = req.params.postId;
	var author = req.session.user._id;
	var title = req.fields.title;
	var content = req.fields.content;

	PostModel.updatePost(postId, author, { title, content })
		.then(() => {
			req.flash('success', '编辑文章成功');
			res.redirect(`/posts/${postId}`);
		})
		.catch(next)
});

// GET /posts/:postId/remove 删除一篇文章
router.get('/:postId/remove', checkLogin, function(req, res, next) {
	var postId = req.params.postId;
	var author = req.session.user._id;

	PostModel.deletePost(postId, author)
		.then(() => {
			req.flash('success', '删除文章成功');
			res.redirect('/posts');
		})
		.catch(next);

});


// POST /posts/:postId/comment 创建一条留言
router.post('/:postId/comment', checkLogin, function(req, res, next) {
	res.send(req.flash())
})
// GET /posts/:postId/comment/:commentId/remove 删除一条留言
router.get('/:postId/comment/:commentId/remove', checkLogin, function(req, res, next) {
	res.send(req.flash())
})

module.exports = router;