import { store, selectStaticDocument } from '@editor/store'
import { ROOT } from '@editor/store/root/constants'
import { useEffect, useState } from 'react'

import { storeStateToLocalStorage } from './local-storage-notice'
import { useEditorStrings } from '@/contexts/logged-in-data-context'

export function LocalStorageButton({ open }: { open: boolean }) {
  const [savedToLocalstorage, setSavedToLocalstorage] = useState(false)

  const edtrIoStrings = useEditorStrings().edtrIo
  useEffect(() => {
    //reset when modal opens
    if (open) setSavedToLocalstorage(false)
  }, [open])

  return (
    <button
      className="serlo-button-blue mt-3"
      onClick={() => {
        const staticRoot = selectStaticDocument(store.getState(), ROOT)
        storeStateToLocalStorage(staticRoot)
        setSavedToLocalstorage(true)
      }}
    >
      {savedToLocalstorage
        ? edtrIoStrings.revisionSaved
        : edtrIoStrings.saveRevision}
    </button>
  )
}
