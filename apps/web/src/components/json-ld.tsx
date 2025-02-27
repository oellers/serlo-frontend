import Head from 'next/head'

import type { EntityBaseProps } from './entity/entity-base'
import { useInstanceData } from '@/contexts/instance-context'
import { getLicense } from '@/data/licenses/licenses-helpers'
import { UuidType } from '@/data-types'

interface JsonLdProps {
  data: EntityBaseProps['page']
  id: number
}

// courses are not supported since we redirect them to first course page anyway
const typeStrings: Partial<Record<UuidType, string>> = {
  Article: 'Article',
  Applet: 'WebApplication',
  Course: 'Article',
  Exercise: 'Quiz',
  ExerciseGroup: 'Quiz',
  TaxonomyTerm: 'Collection',
  Video: 'VideoObject',
}

export function JsonLd({ data, id }: JsonLdProps) {
  const { lang, licenses } = useInstanceData()

  const isEntity = data.kind === 'single-entity'
  const isTaxonomy = data.kind === 'taxonomy'
  const entityType = isEntity ? data.entityData.typename : UuidType.TaxonomyTerm

  if (!Object.hasOwn(typeStrings, entityType)) return null
  const typeString = typeStrings[entityType]

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(getData()) }}
      ></script>
    </Head>
  )

  function getData() {
    const type = ['LearningResource', typeString]
    const learningResourceType = typeString

    const version =
      isEntity && data.entityData.revisionId
        ? getIRI(data.entityData.revisionId)
        : undefined

    const license =
      isEntity && data.entityData.licenseId
        ? { id: getLicense(licenses, data.entityData.licenseId).url }
        : undefined

    const isPartOf = data.breadcrumbsData
      ?.map((node) => (node.id ? getIRI(node.id) : null))
      .filter(Boolean)

    const taxonomyDataChildren = isTaxonomy
      ? [
          ...data.taxonomyData.subterms,
          ...data.taxonomyData.applets,
          ...data.taxonomyData.articles,
          ...data.taxonomyData.courses,
          ...data.taxonomyData.events,
          ...data.taxonomyData.exercises,
          ...data.taxonomyData.videos,
        ]
      : undefined

    const hasPart = isTaxonomy
      ? taxonomyDataChildren?.map((node) => getIRI(node.id))
      : undefined

    const collectionSize = isTaxonomy ? taxonomyDataChildren?.length : undefined

    const about = data.breadcrumbsData?.[0]?.id
      ? [
          {
            id: getIRI(data.breadcrumbsData[0].id),
            name: data.breadcrumbsData[0].label,
            type: 'Thing',
          },
        ]
      : undefined

    return {
      '@context': {
        id: '@id',
        type: '@type',
        '@language': lang,
        '@vocab': 'http://schema.org/',
        skos: 'http://www.w3.org/2004/02/skos/core#',
        prefLabel: {
          '@id': 'skos:prefLabel',
          '@container': '@language',
        },
        inScheme: 'skos:inScheme',
        Concept: 'skos:Concept',
      },
      id: getIRI(id),
      type,
      learningResourceType,
      name: data.metaData?.title,
      description: data.metaData?.metaDescription,
      dateCreated: data.metaData?.dateCreated,
      dateModified: data.metaData?.dateModified,
      version,
      license,
      isAccessibleForFree: true,
      isFamilyFriendly: true,
      publisher: 'https://serlo.org/',
      inLanguage: lang,
      audience: [
        {
          id: 'http://purl.org/dcx/lrmi-vocabs/educationalAudienceRole/student',
          audienceType: 'student',
          type: 'Audience',
        },
      ],
      isPartOf,
      applicationCategory:
        entityType === UuidType.Applet
          ? 'https://www.geogebra.org/'
          : undefined,
      hasPart,
      collectionSize,
      about,
    }
    function getIRI(id: number) {
      return `https://serlo.org/${id}`
    }
  }
}
