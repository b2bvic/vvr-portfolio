import { SEOHead } from '@/components/SEOHead'
import { formatDate } from '@/utils/date'
import { Card } from './Card'
import { Container } from './Container'
import { Layout } from './Layout'

function Article({ article }: { article: any }) {
  return (
    <Card as="article">
      <Card.Title href={`/blog/${article.slug}`}>
        {article.title}
      </Card.Title>
      <Card.Eyebrow as="time" dateTime={article.date} decorate>
        {formatDate(article.date)}
      </Card.Eyebrow>
      <Card.Description>{article.excerpt}</Card.Description>
      <Card.Cta>Read article</Card.Cta>
    </Card>
  )
}

export function BlogIndex({ posts }: { posts: any[] }) {
  return (
    <Layout>
      <SEOHead
        title="Blog - Victor Valentine Romo"
        description="Articles on SEO, system architecture, and growth strategies by Victor Valentine Romo. Insights and practical approaches to building scalable digital systems, optimizing for search engines, and implementing sustainable growth strategies."
        type="website"
      />
      <Container className="mt-16 sm:mt-32">
        <header className="max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl dark:text-zinc-100">
            Writing on SEO, system architecture, and growth strategies.
          </h1>
          <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
            Insights and practical approaches to building scalable digital systems, optimizing for search engines, and implementing sustainable growth strategies.
          </p>
        </header>
        <div className="mt-16 sm:mt-20">
          <div className="md:border-l md:border-zinc-100 md:pl-6 md:dark:border-zinc-700/40">
            <div className="flex max-w-3xl flex-col space-y-16">
              {posts && posts.length > 0 ? (
                posts.map((article) => (
                  <Article key={article.slug} article={article} />
                ))
              ) : (
                <p>No articles found.</p>
              )}
            </div>
          </div>
        </div>
      </Container>
    </Layout>
  )
} 