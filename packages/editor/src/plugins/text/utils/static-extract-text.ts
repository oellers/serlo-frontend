import { AnyEditorDocument } from '@editor/types/editor-plugins'
import { isTextDocument } from '@editor/types/plugin-type-guards'
import type { Descendant } from 'slate'

export function extractDescendant(node: Descendant): string {
  if (Object.hasOwn(node, 'type') && Object.hasOwn(node, 'children')) {
    return node.children.map(extractDescendant).join(' ')
  }
  return node.text ? node.text.trim() : ''
}

export function extractStringFromTextDocument(document?: AnyEditorDocument) {
  if (document && isTextDocument(document) && document.state.length > 0) {
    return document.state.map(extractDescendant).join(' ').trim()
  }
  return ''
}
