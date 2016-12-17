let marked = require('marked');
let Post = require('../lib/mongo').Post

// 将post的content从markdown转换成html
Post.plugin('content2Html', {
   afterFind(posts) {
       if(!posts) return [];
       return posts.forEach(post => {
           "use strict";
           post.content = marked(post.content)
       })
   },
    afterFindOne(post) {
       if(post) post.content = marked(post.content);
       return post;
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
            .addCreateAt()
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
            .addCreateAt()
            .content2Html()
            .exec((err, posts) => {
                err && console.log(err);
            });
    },
    incPv(postId) {
        "use strict";
        return Post.update({_id: postId}, { $inc: { pv: 1 } })
            .exec();
    }
}