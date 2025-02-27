import { EditorTooltip } from '@editor/editor-ui/editor-tooltip'
import { SerloAddButton } from '@editor/plugin/helpers/serlo-editor-button'
import { faFileImport } from '@fortawesome/free-solid-svg-icons'
import request from 'graphql-request'
import NProgress from 'nprogress'
import { useState } from 'react'

import { endpoint } from '@/api/endpoint'
import { UuidUrlInput } from '@/components/author/uuid-url-input'
import { FaIcon } from '@/components/fa-icon'
import { ModalWithCloseButton } from '@/components/modal-with-close-button'
import { useInstanceData } from '@/contexts/instance-context'
import { useEditorStrings } from '@/contexts/logged-in-data-context'
import { UuidType } from '@/data-types'
import type {
  MainUuidQuery,
  MainUuidQueryVariables,
} from '@/fetcher/graphql-types/operations'
import { dataQuery } from '@/fetcher/query'
import { showToastNotice } from '@/helper/show-toast-notice'
import { triggerSentry } from '@/helper/trigger-sentry'
import {
  type ConvertResponseError,
  convertEditorResponseToState,
  isError,
} from '@/serlo-editor-integration/convert-editor-response-to-state'

export function ExternalRevisionLoader<T>({
  entityType,
  onSwitchRevision,
}: {
  entityType: UuidType
  onSwitchRevision: (data: T) => void
}) {
  const [showRevisions, setShowRevisions] = useState(false)

  const { strings } = useInstanceData()
  const editorStrings = useEditorStrings()

  const exerciseTypes = [UuidType.Exercise]
  const supportedEntityTypes = exerciseTypes.includes(entityType)
    ? exerciseTypes
    : [entityType]

  return (
    <div>
      <span onClick={() => setShowRevisions(true)}>
        <button className="serlo-button-editor-secondary serlo-tooltip-trigger">
          <EditorTooltip
            text={editorStrings.edtrIo.importOther}
            className="-left-40"
          />
          <FaIcon icon={faFileImport} className="text-md" />
        </button>
      </span>

      <ModalWithCloseButton
        isOpen={showRevisions}
        setIsOpen={setShowRevisions}
        title={editorStrings.edtrIo.importOther}
        className="max-h-[80vh] w-[900px] max-w-[90vw] -translate-x-1/2 overflow-y-auto pt-0"
      >
        <>
          <p className="serlo-p">
            {editorStrings.edtrIo.importOtherExplanation}
            <br />
            <br />
            <b>{editorStrings.edtrIo.importOtherWarning}</b>
          </p>
          <div className="mx-side">
            <UuidUrlInput
              renderButtons={(
                _typename: string,
                id: number,
                _title: string,
                _taxType?: unknown
              ) => (
                <SerloAddButton
                  text={editorStrings.edtrIo.importOtherButton}
                  onClick={() => fetchRevisionDataByUuid(id)}
                />
              )}
              supportedEntityTypes={supportedEntityTypes}
              supportedTaxonomyTypes={[]}
            />
          </div>
        </>
      </ModalWithCloseButton>
    </div>
  )

  function fetchRevisionDataByUuid(id: number) {
    NProgress.start()

    void (async () => {
      try {
        const data = await request<MainUuidQuery, MainUuidQueryVariables>(
          endpoint,
          dataQuery,
          {
            id,
          }
        )
        const { uuid } = data
        const converted = convertEditorResponseToState(uuid!)
        if (isError(converted) || !uuid) {
          handleError(
            `editor: revision conversion | ${
              (converted as ConvertResponseError).error
            }`
          )
        } else {
          const displayId =
            Object.hasOwn(uuid, 'currentRevision') &&
            uuid.currentRevision &&
            Object.hasOwn(uuid.currentRevision, 'id')
              ? uuid.currentRevision.id
              : uuid.id

          onSwitchRevision({
            ...(converted.state as T),
            revision: 0,
            id: 0,
            meta_title: '',
            meta_description: '',
            changes: `${strings.unrevisedRevisions.importedContentIdentifier}: https://serlo.org/${displayId}`,
          } as T)
          setShowRevisions(false)
        }
      } catch (e) {
        handleError('editor: revision conversion failed')
      } finally {
        NProgress.done()
      }
    })()
  }
}

function handleError(message: string) {
  void triggerSentry({ message })
  void showToastNotice('Sorry, could not load revision 🥵', 'warning')
}
