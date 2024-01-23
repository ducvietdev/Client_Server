import React, { Suspense, useEffect } from 'react'

// ** Router Import
import Router from './router/Router'
import { useLocation } from 'react-router-dom'
import { useNavigation } from './utility/hooks/useNavigation'

const App = () => {
  const { setNavigation } = useNavigation()
  const location = useLocation()
  const navigationLocalStorage = location.pathname.split('/')[2]
  // useEffect(() => {
  //   // Lúc này thì không cần sử dụng Button cho Breadcrumb nữa ==> Có thể bỏ đi
  //   setNavigation(navigationLocalStorage)
  // }, [navigationLocalStorage])
  useEffect(() => {
    window.addEventListener('popstate', function(){
      setNavigation(navigationLocalStorage)
    })
  }, [])
  return (
    <Suspense fallback={null}>
      <Router />
    </Suspense>
  )
}

export default App
