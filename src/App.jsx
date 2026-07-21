import { useState, useEffect } from 'react';
import Auth from './Auth';
import Dashboard from './Dashboard';

export default function App() {
  // Check if a user is already logged in when the app first loads
  const [loggedInUser, setLoggedInUser] = useState(() => {
    const savedUser = localStorage.getItem("username");
    const savedToken = localStorage.getItem("token");
    
    // Only restore the session if BOTH the token and username exist
    if (savedUser && savedToken) {
      return { username: savedUser }; 
    }
    return null;
  });

  // --- SECURE LOGOUT FUNCTION ---
  const handleLogout = () => {
    // 1. Destroy the cryptographic token
    localStorage.removeItem("token");
    
    // 2. Remove the stored username
    localStorage.removeItem("username");
    
    // 3. Reset the application state to force a redirect to the login screen
    setLoggedInUser(null);
  };

  return (
    <div>
      {/* 
        If loggedInUser is null, show the Auth screen.
        Otherwise, show the Dashboard and pass the handleLogout function to it.
      */}
      {!loggedInUser ? (
        <Auth setLoggedInUser={setLoggedInUser} />
      ) : (
        <Dashboard 
          user={loggedInUser} 
          handleLogout={handleLogout} 
        />
      )}
    </div>
  );
}