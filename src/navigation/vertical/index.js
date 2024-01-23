// ** Navigation imports
import apps from './apps'
import knowledges from './knowledges'
import managements from './managements'
import pages from './pages'
import forms from './forms'
import tables from './tables'
import others from './others'
import charts from './charts'
import dashboards from './dashboards'
import uiElements from './ui-elements'

// ** Merge & Export
export default [...dashboards, ...pages, ...uiElements, ...forms, ...tables, ...charts, ...apps, ...knowledges, ...others]
// export default [...managements, ...knowledges]

