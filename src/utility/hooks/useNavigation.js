// ** React Imports
// import { useEffect } from 'react'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'
import { handleNavigation } from '../../redux/navigation'

export const useNavigation = () => {
  // ** Hooks
  const dispatch = useDispatch()
  const store = useSelector(state => state.navigation)

  const setNavigation = type => {
    dispatch(handleNavigation(type))
  }

  return { navigation: store.navigation, setNavigation }
}

