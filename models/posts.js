let marked = require('marked');
let Post = require('../lib/mongo').Post;
let CommentModel = require('./comments');

// 将post的content从markdown转换成html
Post.plugin('content2Html', {
   afterFind(posts) {
       if(!posts) return [];
       return posts.map(post => {
           "use strict";
           post.content = marked(post.content);
           return post;
       })
   },
    afterFindOne(post) {
       if(post) post.content = marked(post.content);
       return post;
   }
});

// 给post添加留言数commentsCount
Post.plugin('addCommentsCount', {
    afterFind(posts) {
        return Promise.all(posts.map(post => {
            "use strict";
            return CommentModel.fetchCommentsCount(post._id).then(count => {
                post.commentsCount = count;
                return post;
            })
        }))
    },
    afterFindOne(post) {
        if(!post) return post;
        return CommentModel.fetchCommentsCount(post._id).then(count => {
            post.commentsCount = count;
            return post;
        })
    }
});

module.exports = {
    create(post) {
        "use strict";
        return Post.create(post).exec();
    },
    fetchPostById(postId) {
        "use strict";
        return Post
            .findOne({ _id: postId })
            .populate({ path: 'author', model: 'User' })
            .addCreatedAt()
            .addCommentsCount()
            .content2Html()
            .exec(err => {
                if(err) console.log(err);
            });
    },
    fetchPosts(author) {
        "use strict";
        let query = author ? {author} : {};
        return Post
            .find(query)
            .populate({ path: 'author', model: 'User' })
            .sort({ _id: -1 })
            .addCreatedAt()
            .addCommentsCount()
            .content2Html()
            .exec((err, posts) => {
                err && console.log(err);
                console.log(posts);
            });
    },
    incPv(postId) {
        "use strict";
        return Post.update({_id: postId}, { $inc: { pv: 1 } })
            .exec();
    },
    // 获取未加工的文章, 用于修改
    fetchRawPostById(postId) {
        "use strict";
        return Post
            .findOne({ _id: postId })
            .populate({ path: 'author', model: 'User' })
            .exec();
    },
    // 更新一篇文章
    updatePost(postId, author, data) {
        return Post.update({ author, _id: postId }, { $set: data }).exec();

    },
    // 删除一篇文章
    deletePost(postId, author) {
        return Post.remove({ author, _id: postId })
            .exec()
            .then(res => {
                if(res.result.ok && res.result.n > 0) {
                    return CommentModel.delCommentsByPostId(postId);
                }
            })
    }
};