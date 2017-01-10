let marked = require('marked');
let Comment = require('../lib/mongo').Comment;

Comment.plugin('content2Html', {
    afterFind(comments) {
        "use strict";
        return comments.map(comment => {
            comment.content = marked(comment.content);
            return comment;
        })
    }
});

module.exports = {
    // 创建新留言
    create(content) {
        return Comment.create(content).exec();
    },
    fetchComments(postId) {
        "use strict";
        return Comment.find({ postId: postId })
            .populate({ path: 'author', model: 'User' })
            .sort({ _id: -1 })
            .addCreatedAt()
            .content2Html()
            .exec();
    },
    // 查找某文章的留言数
    fetchCommentsCount(postId) {
        return Comment.count({ postId }).exec();
    },
    // 通过文章id，删除该文章下的所有留言
    delCommentsByPostId(postId) {
        return Comment.remove({ postId }).exec();
    },
    // 通过用户id、留言id删除一条留言
    delCommentByCommentId(commentId, author) {
        return Comment.remove({ author, _id: commentId }).exec();
    }
};