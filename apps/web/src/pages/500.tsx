import { FrontendClientBase } from '@/components/frontend-client-base/frontend-client-base'
import { ErrorPage } from '@/components/pages/error-page'

export default function Custom404() {
  return (
    <FrontendClientBase>
      <ErrorPage code={503} />
    </FrontendClientBase>
  )
}
