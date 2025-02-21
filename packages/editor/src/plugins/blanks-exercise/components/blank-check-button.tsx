import { ExerciseFeedback } from '@editor/editor-ui/exercises/exercise-feedback'
import { useInstanceData } from '@serlo/frontend/src/contexts/instance-context'

interface BlankCheckButtonProps {
  isVisible: boolean
  feedback: Map<string, { isCorrect?: boolean | undefined }>
  isFeedbackVisible: boolean
  onClick: () => void
}

export function BlankCheckButton(props: BlankCheckButtonProps) {
  const { isVisible, feedback, isFeedbackVisible, onClick } = props

  const exercisesStrings = useInstanceData().strings.content.exercises

  if (!isVisible) return null

  const isCorrect = [...feedback].every((entry) => entry[1].isCorrect)

  return (
    <div className="mt-2 flex">
      <button
        className="serlo-button-blue mr-3 h-8"
        onClick={onClick}
        data-qa="plugin-exercise-check-answer-button"
      >
        {exercisesStrings.check}
      </button>
      {isFeedbackVisible ? <ExerciseFeedback correct={isCorrect} /> : null}
    </div>
  )
}
