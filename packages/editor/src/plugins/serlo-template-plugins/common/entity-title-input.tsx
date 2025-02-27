import { EditorPluginProps } from '@editor/plugin'
import { useAppDispatch, focus } from '@editor/store'
import { useEffect, useRef } from 'react'

import { type AppletTypePluginState } from '../applet'
import { useEditorStrings } from '@/contexts/logged-in-data-context'
import { cn } from '@/helper/cn'

export function EntityTitleInput({
  title,
  forceFocus,
  className,
  compact,
}: {
  title: EditorPluginProps<AppletTypePluginState>['state']['title']
  forceFocus?: boolean
  className?: string
  compact?: boolean
}) {
  const { titlePlaceholder } = useEditorStrings().templatePlugins.entity

  const titleRef = useRef<HTMLInputElement>(null)

  const dispatch = useAppDispatch()

  useEffect(() => {
    if (!forceFocus) return
    // focus on title, remove focus from content
    setTimeout(() => {
      dispatch(focus(null))
      titleRef.current?.focus()
    })
    // only after creating plugin
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <h1 className={compact ? '' : 'serlo-h1 mt-20'}>
      <input
        autoFocus={forceFocus ? undefined : true}
        ref={titleRef}
        className={cn(`mt-4 w-full border-none focus:outline-none`, className)}
        placeholder={titlePlaceholder}
        value={title.value}
        onChange={(e) => title.set(e.target.value)}
        data-qa="entity-title-input"
      />
    </h1>
  )
}
