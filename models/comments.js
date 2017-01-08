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
    create() {
        "use strict";

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
    fetchCommentsCount(postId) {
        "use strict";
        return Comment.count({ postId }).exec();
    },
    delCommentsByPostId(postId) {
        "use strict";

    },
    delCommentByCommentId(commentId, author) {
        "use strict";

    }
};