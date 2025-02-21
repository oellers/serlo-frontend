import { StaticRenderer } from '@editor/static-renderer/static-renderer'
import type { EditorBlanksExerciseDocument } from '@editor/types/editor-plugins'

import type { BlanksExerciseMode } from '.'
import { BlanksExerciseRenderer, BlanksExerciseRendererProps } from './renderer'

export function BlanksExerciseStaticRenderer({
  state: { text: childPlugin, mode, extraDraggableAnswers },
  onEvaluate,
}: EditorBlanksExerciseDocument & {
  onEvaluate?: BlanksExerciseRendererProps['onEvaluate']
}) {
  return (
    <BlanksExerciseRenderer
      childPlugin={<StaticRenderer document={childPlugin} />}
      childPluginState={childPlugin}
      mode={mode as BlanksExerciseMode}
      initialTextInBlank="empty"
      extraDraggableAnswers={extraDraggableAnswers}
      onEvaluate={onEvaluate}
    />
  )
}
