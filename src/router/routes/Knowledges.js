import { lazy } from 'react'
const ExcelContainer = lazy(() => import('../../views/knowledges/FormatExcel'))
const FormContainer = lazy(() => import('../../views/knowledges/FormValidation'))
const WordContainer = lazy(() => import('../../views/knowledges/FormatWord'))

const KnowledgeRoutes = [
  {
    path: '/knowledges/form-validation',
    element: <FormContainer />
  },
  {
    path: '/knowledges/format-excel',
    element: <ExcelContainer />
  },
  {
    path: '/knowledges/format-word',
    element: <WordContainer />
  }
]

export default KnowledgeRoutes
