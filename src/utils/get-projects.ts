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
        date: projectData.date || new Date().toISOString(),
        excerpt: projectData.excerpt || '',
        client: projectData.client || '',
        description: projectData.markdownContent || '',
        featuredImage: projectData.featuredImage || null
      }
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  
  return projects
}
