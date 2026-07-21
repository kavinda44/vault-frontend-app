import { useState, useEffect } from 'react'
import Auth from './Auth'
import Dashboard from './Dashboard'

function App() {
  // 1. Initialize state securely from localStorage to prevent refresh crashes
  const [loggedInUser, setLoggedInUser] = useState(() => {
    const savedSession = localStorage.getItem("vault_session");
    const savedToken = localStorage.getItem("token");
    
    // Only restore the session if BOTH the token and full user data exist
    if (savedSession && savedToken) {
      return JSON.parse(savedSession); 
    }
    return null;
  });

  // 2. Automatically save the full user object (including balance) whenever it updates
  useEffect(() => {
    if (loggedInUser) {
      localStorage.setItem("vault_session", JSON.stringify(loggedInUser));
    }
  }, [loggedInUser]);

  // 3. Secure logout destroys the JWT token and the session memory
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("vault_session"); 
    setLoggedInUser(null);
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