import { allContent } from './content'

export function getAllPosts() {
  const allItems = allContent()
  const posts = allItems
    .filter(item => 
      item.__metadata?.id?.includes('/blog/') && 
      item.__metadata?.modelName === 'PostLayout'
    )
    .map(post => {
      const postData = post as any
      
      // Extract slug from file path or URL path
      let slug = ''
      if (post.__metadata?.urlPath) {
        slug = post.__metadata.urlPath.replace('/blog/', '')
      } else if (post.__metadata?.id) {
        // Extract filename without extension from the path
        const filename = post.__metadata.id.split('/').pop() || ''
        slug = filename.replace(/\.md$/, '')
      }
      
      return {
        slug: slug || 'untitled',
        title: postData.title || 'Untitled',
        date: postData.date || new Date().toISOString(),
        excerpt: postData.excerpt || '',
        content: postData.markdownContent || '',
        featuredImage: postData.featuredImage || null
      }
    })
    .filter(post => post.slug !== 'untitled') // Filter out posts without proper slugs
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  
  return posts
}
