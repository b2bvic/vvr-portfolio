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
      return {
        slug: post.__metadata?.urlPath?.replace('/blog/', '') || '',
        title: postData.title || 'Untitled',
        date: postData.date || new Date().toISOString(),
        excerpt: postData.excerpt || '',
        content: postData.markdownContent || '',
        featuredImage: postData.featuredImage || null
      }
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  
  return posts
}
