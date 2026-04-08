import { useState } from 'react'
import Auth from './Auth'
import Dashboard from './Dashboard'

function App() {
  const [loggedInUser, setLoggedInUser] = useState(null)

  const handleLogout = () => {
    setLoggedInUser(null)
  }

 
  return (
    <>
      {loggedInUser ? (
        <Dashboard user={loggedInUser} handleLogout={handleLogout} />
      ) : (
        <Auth setLoggedInUser={setLoggedInUser} />
      )}
    </>
  )
}

export default App