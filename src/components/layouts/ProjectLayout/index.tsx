import classNames from 'classnames';
import Markdown from 'markdown-to-jsx';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import * as React from 'react';

import { Annotated } from '@/components/Annotated';
import { DynamicComponent } from '@/components/components-registry';
import ImageBlock from '@/components/molecules/ImageBlock';
import { Container } from '@/components/spotlight/Container';
import { Layout } from '@/components/spotlight/Layout';
import { PageComponentProps, ProjectLayout } from '@/types';
import HighlightedPreBlock from '@/utils/highlighted-markdown';

type ComponentProps = PageComponentProps &
    ProjectLayout & {
        prevProject?: ProjectLayout;
        nextProject?: ProjectLayout;
    };

function ArrowLeftIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props}>
      <path
        d="M7.25 11.25 3.75 8m0 0 3.5-3.25M3.75 8h8.5"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

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

const Component: React.FC<ComponentProps> = (props) => {
    const {
        title,
        date,
        client,
        description,
        markdownContent,
        media,
        prevProject,
        nextProject,
        bottomSections = []
    } = props;
    const router = useRouter();

    return (
        <Layout>
            <Head>
                <title>{title} - Victor Valentine Romo</title>
                <meta name="description" content={description || ''} />
            </Head>
            <Container className="mt-16 lg:mt-32">
                <div className="xl:relative">
                    <div className="mx-auto max-w-2xl">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            aria-label="Go back to projects"
                            className="group mb-8 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md shadow-zinc-800/5 ring-1 ring-zinc-900/5 transition dark:border dark:border-zinc-700/50 dark:bg-zinc-800 dark:ring-0 dark:ring-white/10 dark:hover:border-zinc-700 dark:hover:ring-white/20 lg:absolute lg:-left-5 lg:mb-0 lg:-mt-2 xl:-top-1.5 xl:left-0 xl:mt-0"
                        >
                            <ArrowLeftIcon className="h-4 w-4 stroke-zinc-500 transition group-hover:stroke-zinc-700 dark:stroke-zinc-500 dark:group-hover:stroke-zinc-400" />
                        </button>
                        <article>
                            <header className="flex flex-col">
                                <h1 className="mt-6 text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl dark:text-zinc-100">
                                    {title}
                                </h1>
                                {description && (
                                    <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
                                        {description}
                                    </p>
                                )}
                                {client && (
                                    <div className="mt-6">
                                        <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                                            Client: {client}
                                        </p>
                                    </div>
                                )}
                            </header>
                            
                            {media && (
                                <div className="mt-8">
                                    <ProjectMedia media={media} />
                                </div>
                            )}
                            
                            {markdownContent && (
                                <Markdown
                                    options={{ forceBlock: true, overrides: { pre: HighlightedPreBlock } }}
                                    className="mt-8 prose dark:prose-invert"
                                >
                                    {markdownContent}
                                </Markdown>
                            )}
                        </article>
                    </div>
                </div>
            </Container>
            {bottomSections?.map((section, index) => {
                return <DynamicComponent key={index} {...section} />;
            })}
        </Layout>
    );
};
export default Component;

function ProjectMedia({ media }) {
    return <DynamicComponent {...media} className="aspect-video w-full rounded-2xl bg-zinc-100 object-cover dark:bg-zinc-800" />;
}

function ProjectNavItem({ project, className }) {
    return (
        <Annotated content={project}>
            <Link className={classNames('group flex flex-col gap-6 items-start', className)} href={project}>
                {project.featuredImage && (
                    <div className="w-full overflow-hidden aspect-3/2">
                        <ImageBlock
                            {...project.featuredImage}
                            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                        />
                    </div>
                )}
                <span className="text-lg leading-tight uppercase transition bottom-shadow-1 group-hover:bottom-shadow-5">
                    {project.title}
                </span>
            </Link>
        </Annotated>
    );
}
