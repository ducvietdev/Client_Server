// ** React Imports
import { Outlet } from 'react-router-dom'

// ** Core Layout Import
// !Do not remove the Layout import
import Layout from '@layouts/VerticalLayout'

// ** Menu Items Array
import menu from '@src/navigation/vertical/managements.js'
// import menu_user from '@src/navigation/vertical/managements_user.js'
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { getUserData } from '../utility/Utils'
const VerticalLayout = props => {
  const featuredNavigation = useSelector(state => state.navigation)
  const [menuData, setMenuData] = useState([])

  useEffect(() => {
    if (featuredNavigation.navigation === 'home') {
      if (getUserData().roleName !== '') {
        setMenuData(menu)
      }
    } else {
      const featuredId = menu.filter(item => item.id === featuredNavigation.navigation)
      setMenuData(featuredId)
    }
  }, [featuredNavigation.navigation])

  return (
    <Layout menuData={menuData} {...props}>
      <Outlet />
    </Layout>
  )
}

export default VerticalLayout
