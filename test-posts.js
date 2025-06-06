const { getAllPosts } = require('./src/utils/get-posts.ts'); const posts = getAllPosts(); console.log('Total posts:', posts.length); console.log('First post:', JSON.stringify(posts[0], null, 2));
