import { allContent } from '@/utils/content';
import { getAllPosts } from '@/utils/get-posts';
import { getAllProjects } from '@/utils/get-projects';
import { GetServerSideProps } from 'next';

function generateSiteMap(pages: any[], posts: any[], projects: any[]) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://victorvalentineromo.com';
  const currentDate = new Date().toISOString().split('T')[0];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Static Pages -->
  <url>
    <loc>${siteUrl}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${siteUrl}/about-me</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${siteUrl}/services</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${siteUrl}/projects</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${siteUrl}/blog</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  
  <!-- Blog Posts -->
  ${posts
    .map((post) => {
      const postDate = new Date(post.date).toISOString().split('T')[0];
      return `  <url>
    <loc>${siteUrl}/blog/${post.slug}</loc>
    <lastmod>${postDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
    })
    .join('\n')}
  
  <!-- Projects -->
  ${projects
    .map((project) => {
      return `  <url>
    <loc>${siteUrl}/projects/${project.slug}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
    })
    .join('\n')}
    
  <!-- Dynamic Pages from Content -->
  ${pages
    .filter(page => 
      page.__metadata?.urlPath && 
      page.__metadata.urlPath !== '/' && 
      !page.__metadata.urlPath.startsWith('/blog/') &&
      !page.__metadata.urlPath.startsWith('/projects/')
    )
    .map((page) => {
      return `  <url>
    <loc>${siteUrl}${page.__metadata.urlPath}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
    })
    .join('\n')}
</urlset>`;
}

function SiteMap() {
  // getServerSideProps will do the heavy lifting
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  // Get all content
  const allPages = allContent();
  const posts = getAllPosts();
  const projects = getAllProjects();

  // Generate the XML sitemap
  const sitemap = generateSiteMap(allPages, posts, projects);

  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};

export default SiteMap; 