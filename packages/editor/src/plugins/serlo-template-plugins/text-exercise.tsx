import {
  type EditorPlugin,
  type EditorPluginProps,
  type PrettyStaticState,
} from '@editor/plugin'
import { selectStaticDocument, store } from '@editor/store'
import { EditorPluginType } from '@editor/types/editor-plugin-type'
import { AiExerciseGenerationButton } from '@serlo/frontend/src/components/exercise-generation/ai-exercise-generation-button'
import { useAiFeatures } from '@serlo/frontend/src/components/exercise-generation/use-ai-features'
import { UuidType } from '@serlo/frontend/src/data-types'
import { cn } from '@serlo/frontend/src/helper/cn'
import { ContentLoaders } from '@serlo/frontend/src/serlo-editor-integration/components/content-loaders/content-loaders'
import { useRouter } from 'next/router'

import { editorContent, entity, entityType } from './common/common'
import { ToolbarMain } from './toolbar-main/toolbar-main'

export const textExerciseTypeState = entityType(
  {
    ...entity,
    content: editorContent(EditorPluginType.Exercise),
  },
  {}
)

export type TextExerciseTypePluginState = typeof textExerciseTypeState

/** Exercise with an optional solution spoiler */
export const textExerciseTypePlugin: EditorPlugin<
  TextExerciseTypePluginState,
  { skipControls: boolean }
> = {
  Component: TextExerciseTypeEditor,
  state: textExerciseTypeState,
  config: { skipControls: false },
}

function TextExerciseTypeEditor({
  state,
  config,
  id,
}: EditorPluginProps<TextExerciseTypePluginState, { skipControls: boolean }>) {
  const { content } = state

  const { canUseAiFeatures } = useAiFeatures()

  const router = useRouter()
  const currentPath = router.asPath.toLowerCase()
  const isCreatingNewExercise = currentPath.includes('/create/exercise')

  const staticDocument = selectStaticDocument(store.getState(), id)
    ?.state as PrettyStaticState<TextExerciseTypePluginState>
  if (!staticDocument) return null

  return (
    <>
      {config.skipControls ? null : (
        <div className="absolute right-0 -mt-20 mr-side flex flex-row gap-4">
          {canUseAiFeatures && isCreatingNewExercise ? (
            <AiExerciseGenerationButton isSingularExercise />
          ) : null}
          <ContentLoaders
            id={state.id.value}
            currentRevision={state.revision.value}
            onSwitchRevision={state.replaceOwnState}
            entityType={UuidType.Exercise}
          />
        </div>
      )}
      <article
        className={cn('text-exercise', config.skipControls ? 'mt-12' : 'mt-32')}
      >
        {content.render()}
        {config.skipControls ? null : (
          <ToolbarMain showSubscriptionOptions {...state} />
        )}
      </article>
    </>
  )
}
