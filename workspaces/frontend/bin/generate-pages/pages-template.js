const path = require('path')

// Should be completely aligned to the left, otherwise there will be whitespaces in the output.
const generalPageTemplate = (name) => 
`import type { FC } from 'react'
import { useEffect } from 'react'
import type { RouteComponentProps } from 'react-router'
import { handleLegBoRoute } from 'utils/helpers'
import type { SetShowLegacy } from 'types/global-types'
import { Pages } from 'types/route-types'

interface Props extends RouteComponentProps {
  setShowLegacy: SetShowLegacy,
  viewId: Pages
}

const ${name}:FC<Props> = ({ setShowLegacy, viewId }) => {
  // location options are automatically passed in to props via <Route />
  // Conditionally render own content / update legacybackoffice path
  useEffect(() => {
    // Only on mount - trigger legacy backoffice to route to the correct path
    handleLegBoRoute(setShowLegacy, viewId, !Boolean(content))
  }, [setShowLegacy, viewId])

  const content = null
  
  return content
}

export default ${name}
`

exports.createPageTemplate = (create, name) => {
  const pathDestination = path.join(__dirname, '../../src/pages')
  create(pathDestination, generalPageTemplate(name))
}
