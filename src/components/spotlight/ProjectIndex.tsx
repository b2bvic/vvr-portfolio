import Head from 'next/head'

import { Card } from './Card'
import { Container } from './Container'
import { Layout } from './Layout'

function LinkIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        d="M15.712 11.823a.75.75 0 1 0 1.06 1.06l1.06-1.06a.75.75 0 0 0-1.06-1.06l-1.06 1.06Zm-4.95 4.95a.75.75 0 0 0 1.06 0l1.06-1.06a.75.75 0 0 0-1.06-1.06l-1.06 1.06a.75.75 0 0 0 0 1.06Zm-2.475-1.414a.75.75 0 0 0-1.06-1.06l-1.06 1.06a.75.75 0 0 0 1.06 1.06l1.06-1.06Zm4.95-4.95a.75.75 0 0 0 1.06 1.06l1.06-1.06a.75.75 0 0 0-1.06-1.06l-1.06 1.06Z"
      />
      <path d="M13.83 9.17a.75.75 0 0 0-1.06 1.06l1.06 1.06a.75.75 0 0 0 1.06-1.06l-1.06-1.06Z" />
    </svg>
  )
}

function Project({ project }: { project: any }) {
  return (
    <Card as="div">
      <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md shadow-zinc-800/5 ring-1 ring-zinc-900/5 dark:border dark:border-zinc-700/50 dark:bg-zinc-800 dark:ring-0">
        <div className="h-8 w-8 rounded-full bg-gradient-to-r from-teal-500 to-cyan-600"></div>
      </div>
      <h2 className="mt-6 text-base font-semibold text-zinc-800 dark:text-zinc-100">
        <Card.Link href={`/projects/${project.slug}`}>{project.title}</Card.Link>
      </h2>
      <Card.Description>{project.excerpt}</Card.Description>
      <p className="relative z-10 mt-6 flex text-sm font-medium text-zinc-400 transition group-hover:text-teal-500 dark:text-zinc-200">
        <LinkIcon className="h-6 w-6 flex-none" />
        <span className="ml-2">View project</span>
      </p>
    </Card>
  )
}

export function ProjectIndex({ projects }: { projects: any[] }) {
  return (
    <Layout>
      <Head>
        <title>Projects - Victor Valentine Romo</title>
        <meta
          name="description"
          content="Case studies and project showcases demonstrating systematic approaches to SEO and digital growth."
        />
      </Head>
      <Container className="mt-16 sm:mt-32">
        <header className="max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl dark:text-zinc-100">
            Projects that scale businesses through systematic approaches.
          </h1>
          <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
            Case studies showcasing real-world applications of strategic SEO, system architecture, and growth optimization that delivered measurable results.
          </p>
        </header>
        <div className="mt-16 sm:mt-20">
          <ul
            role="list"
            className="grid grid-cols-1 gap-x-12 gap-y-16 sm:grid-cols-2 lg:grid-cols-3"
          >
            {projects && projects.length > 0 ? (
              projects.map((project) => (
                <li key={project.slug}>
                  <Project project={project} />
                </li>
              ))
            ) : (
              <li>No projects found.</li>
            )}
          </ul>
        </div>
      </Container>
    </Layout>
  )
} 