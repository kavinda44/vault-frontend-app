import { useState } from 'react';
import './Auth.css'; 

export default function Auth({ setLoggedInUser }) {

    const [isPanelActive, setIsPanelActive] = useState(false);
    
    const [loginUser, setLoginUser] = useState('');
    const [loginPass, setLoginPass] = useState('');
    
    const [regUser, setRegUser] = useState('');
    const [regEmail, setRegEmail] = useState('');
    const [regNic, setRegNic] = useState(''); 
    const [regPass, setRegPass] = useState('');
    
    const [message, setMessage] = useState('');
    
    const [isForgotMode, setIsForgotMode] = useState(false);
    const [forgotEmail, setForgotEmail] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage("Authenticating...");

        try {
            const response = await fetch("https://vault-backend-api-szxu.onrender.com/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: loginUser, password: loginPass })
            });
            const data = await response.json();
            
            if (response.ok) {
                setLoggedInUser({
                    username: data.username,
                    accountNumber: data.account_number,
                    balance: data.balance
                });
            } else {
                setMessage(" " + data.detail);
            }
        } catch (error) {
            setMessage(" Network error.");
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setMessage("Registering securely...");

        try {
            const response = await fetch("https://vault-backend-api-szxu.onrender.com/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: regUser, email: regEmail, nic: regNic, password: regPass })
            });
            const data = await response.json();
            
            if (response.ok) {
                setMessage(" Registration successful! Please check your email to verify your account.");
                setIsPanelActive(false);
            } else {
                setMessage(" Error: " + data.detail);
            }
        } catch (error) {
            setMessage(" Network error.");
        }
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setMessage("Sending reset link...");
        try {
            const response = await fetch("https://vault-backend-api-szxu.onrender.com/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: forgotEmail })
            });
            const data = await response.json();
            setMessage(" Success: " + data.message);
        } catch (error) {
            setMessage(" Network error.");
        }
    };

    return (
        <div className="auth-wrapper">
            
            <div className={`container ${isPanelActive ? "active" : ""}`} id="container">
                
                <div className="form-container sign-up">
                    <form onSubmit={handleRegister}>
                        <div className="mobile-header">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                            Secure Enrollment
                        </div>
                        
                        <h1>Create Account</h1>
                      
                        <input type="text" placeholder="Username" required value={regUser} onChange={(e) => setRegUser(e.target.value)} />
                        <input type="email" placeholder="Email" required value={regEmail} onChange={(e) => setRegEmail(e.target.value)} />
                        <input type="text" placeholder="NIC Number" required value={regNic} onChange={(e) => setRegNic(e.target.value)} />
                        <input type="password" placeholder="Password" required value={regPass} onChange={(e) => setRegPass(e.target.value)} />
                        
                        <button type="submit">Sign Up</button>
                        {isPanelActive && <p style={{color: 'red', fontSize: '13px', marginTop: '15px'}}>{message}</p>}
                    </form>
                </div>

                <div className="form-container sign-in">
                    
                    {isForgotMode ? (
                        <form onSubmit={handleForgotPassword}>
                            <div className="mobile-header">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path></svg>
                                Account Recovery
                            </div>
                            
                            <h1>Reset Password</h1>
                            <span style={{marginBottom: '20px'}}>Enter your email to receive a secure reset link.</span>
                            
                            <input type="email" placeholder="Email Address" required value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} />
                            <button type="submit">Send Reset Link</button>
                            
                            <a href="#" onClick={(e) => { e.preventDefault(); setIsForgotMode(false); setMessage(''); }}>
                                ← Back to Sign In
                            </a>
                            
                            <p style={{color: 'green', fontSize: '13px', marginTop: '15px'}}>{message}</p>
                        </form>
                    ) : (
                        <form onSubmit={handleLogin}>
                            <div className="mobile-header">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                                Secure Vault Login
                            </div>
                            
                            <h1>Sign In</h1>
                            
                            <input type="text" placeholder="Username" required value={loginUser} onChange={(e) => setLoginUser(e.target.value)} />
                            <input type="password" placeholder="Password" required value={loginPass} onChange={(e) => setLoginPass(e.target.value)} />
                            
                            <a href="#" onClick={(e) => { e.preventDefault(); setIsForgotMode(true); setMessage(''); }}>
                                Forget Your Password?
                            </a>
                            
                            <button type="submit">Sign In</button>
                            
                            {!isPanelActive && <p style={{color: 'red', fontSize: '13px', marginTop: '15px'}}>{message}</p>}
                        </form>
                    )}
                </div>

                <div className="toggle-container">
                    <div className="toggle">
                        <div className="toggle-panel toggle-left">
                            <h1>Welcome Back!</h1>
                            <p>Enter your personal details to use all of site features</p>
                            <button className="ghost" onClick={() => { setIsPanelActive(false); setIsForgotMode(false); setMessage(''); }}>
                                Sign In
                            </button>
                        </div>
                        <div className="toggle-panel toggle-right">
                            <h1>Welcome!</h1>
                            <p>Register with your personal details to open a secure account</p>
                            <button className="ghost" onClick={() => setIsPanelActive(true)}>
                                Sign Up
                            </button>
                        </div>
                    </div>
                </div>

            </div>

            
            <div style={{ 
                marginTop: '25px', 
                color: '#475569', 
                fontSize: '12px', 
                textAlign: 'center', 
                maxWidth: '600px', 
                padding: '0 15px',
                lineHeight: '1.5',
                zIndex: 10 
            }}>
                ⚠️ <strong>Disclaimer:</strong> This is a simulated application built solely for a university student security project. No real financial, personal, or sensitive data is collected, stored, or processed.
            </div>

        </div>
    );
}