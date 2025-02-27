import {
  faBrain,
  faExclamationTriangle,
  faFileCircleCheck,
  faHandPointRight,
  faLightbulb,
  faMapSigns,
  faQuoteRight,
  faSplotch,
  faThumbtack,
} from '@fortawesome/free-solid-svg-icons'
import { FaIcon } from '@serlo/frontend/src/components/fa-icon'
import { useInstanceData } from '@serlo/frontend/src/contexts/instance-context'
import { cn } from '@serlo/frontend/src/helper/cn'

export const boxTypeIcons = {
  blank: undefined,
  example: faSplotch,
  quote: faQuoteRight,
  approach: faMapSigns,
  attention: faExclamationTriangle,
  remember: faBrain,
  note: faHandPointRight,
  definition: faThumbtack,
  theorem: faLightbulb,
  proof: faFileCircleCheck,
} as const

export type BoxType = keyof typeof boxTypeIcons
export const types = Object.keys(boxTypeIcons) as BoxType[]

interface BoxProps {
  boxType: BoxType
  anchorId: string
  children: JSX.Element
  title?: JSX.Element | string
  className?: string
}

export function BoxRenderer({
  boxType,
  title,
  anchorId,
  children,
  className,
}: BoxProps) {
  const { strings } = useInstanceData()
  if (!children || !boxType) return null

  const isBlank = boxType === 'blank'
  const isAttention = boxType === 'attention'

  const icon = boxTypeIcons[boxType] ? (
    <FaIcon className="mr-1" icon={boxTypeIcons[boxType]!} />
  ) : null

  return (
    <figure
      id={anchorId}
      className={cn(
        `
          serlo-box relative mx-side mb-6 
          rounded-xl border-3 pb-2 pt-[2px]
          [&>div.my-block]:first:mt-3.5
          [&>div.my-block]:last:mb-3.5
        `,
        isAttention ? 'border-red-100' : 'border-brand-200',
        className
      )}
    >
      <figcaption className="px-side pt-2.5 text-lg">
        <a className="!no-underline">
          {isBlank ? null : (
            <span
              className={cn(
                title && !isBlank ? 'mr-1.5' : '',
                isAttention ? 'text-orange' : 'text-brand'
              )}
            >
              {icon}
              {strings.content.boxTypes[boxType]}
            </span>
          )}
          {title}
        </a>
      </figcaption>

      {boxType === 'quote' ? <blockquote>{children}</blockquote> : children}
    </figure>
  )
}
