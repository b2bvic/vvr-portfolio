import { allContent } from './content'

export function getAllProjects() {
  const allItems = allContent()
  const projects = allItems
    .filter(item => 
      item.__metadata?.id?.includes('/projects/') && 
      item.__metadata?.modelName === 'ProjectLayout'
    )
    .map(project => {
      const projectData = project as any
      return {
        slug: project.__metadata?.urlPath?.replace('/projects/', '') || '',
        title: projectData.title || 'Untitled',
        excerpt: projectData.excerpt || '',
        content: projectData.markdownContent || '',
        featuredImage: projectData.featuredImage || null,
        liveUrl: projectData.liveUrl || null
      }
    })
    .sort((a, b) => a.title.localeCompare(b.title))
  
  return projects
}
