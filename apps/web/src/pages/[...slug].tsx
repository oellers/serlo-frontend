import { GetStaticPaths, GetStaticProps } from 'next'

import { Entity } from '@/components/entity/entity'
import { EntityBase } from '@/components/entity/entity-base'
import { FrontendClientBase } from '@/components/frontend-client-base/frontend-client-base'
import { LoadingSpinner } from '@/components/loading/loading-spinner'
import { Topic } from '@/components/taxonomy/topic'
import { SlugProps } from '@/data-types'
import { Instance } from '@/fetcher/graphql-types/operations'
import { requestPage } from '@/fetcher/request-page'
import { renderedPageNoHooks } from '@/helper/rendered-page'

export default renderedPageNoHooks<SlugProps>(({ pageData }) => {
  //fallback, should be handled by CFWorker, (useful for localhost only)
  if (pageData.kind === 'redirect') {
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        window.location.href = pageData.target!
      }, 1000)
    }
    return (
      <FrontendClientBase>
        <LoadingSpinner noText />
      </FrontendClientBase>
    )
  }

  const page =
    pageData.kind === 'single-entity' ? (
      <Entity data={pageData.entityData} />
    ) : (
      <Topic
        data={pageData.taxonomyData}
        breadcrumbs={pageData.breadcrumbsData}
      />
    )

  const serloEntityData =
    pageData.kind === 'single-entity'
      ? {
          entityId: pageData.entityData.id,
          revisionId: pageData.entityData.revisionId,
        }
      : {
          entityId: pageData.taxonomyData.id,
          revisionId: undefined,
        }

  return (
    <FrontendClientBase
      noContainers
      serloEntityData={serloEntityData}
      authorization={pageData.authorization}
    >
      <EntityBase page={pageData} entityId={serloEntityData.entityId}>
        {page}
      </EntityBase>
    </FrontendClientBase>
  )
})

export const getStaticProps: GetStaticProps<SlugProps> = async (context) => {
  const alias = (context.params?.slug as string[]).join('/')
  const pageData = await requestPage('/' + alias, context.locale! as Instance)

  const isEntity = pageData.kind === 'single-entity'
  // we only support theses three kinds - 404 for everything else
  if (
    pageData.kind !== 'taxonomy' &&
    pageData.kind !== 'redirect' &&
    !isEntity
  ) {
    return { notFound: true, revalidate: 60 * 5 }
  }

  // revalidation settings: 20 mins for taxonomies, 24h for entities
  const revalidate = !isEntity ? 60 * 20 : 60 * 60 * 24

  return {
    props: {
      pageData: JSON.parse(JSON.stringify(pageData)) as SlugProps['pageData'], // remove undefined values
    },
    revalidate,
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}
