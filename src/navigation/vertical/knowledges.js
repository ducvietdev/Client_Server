// ** Icons Import
import { Layers, Square } from 'react-feather'

const children = [
  {
    id: 'form-validation',
    title: 'Form Validation',
    icon: <Square size={12} />,
    navLink: '/knowledges/form-validation'
  },
  {
    id: 'format-excel',
    title: 'Format Excel',
    icon: <Square size={12} />,
    navLink: '/knowledges/format-excel'
  },
  {
    id: 'format-word',
    title: 'Format Word',
    icon: <Square size={12} />,
    navLink: '/knowledges/format-word'
  }
]

export default [
  {
    header: 'Knowledges'
  },
  {
    id: 'knowledges',
    title: 'Knowledges',
    badge: 'light-danger',
    badgeText: children.length,
    icon: <Layers size={20} />,
    children: children
  }
]
