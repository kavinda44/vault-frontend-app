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
        // Added flex layout, min-height, and padding for mobile spacing
        <div className="auth-wrapper flex items-center justify-center min-h-screen w-full bg-[#f8f9fc] p-4 sm:p-8 overflow-hidden">
            
            {/* Added max-width constraints so it shrinks safely on mobile phones */}
            <div className={`container relative w-full max-w-[768px] min-h-[600px] sm:min-h-[550px] bg-white rounded-3xl shadow-2xl overflow-hidden ${isPanelActive ? "active" : ""}`} id="container">
                
                <div className="form-container sign-up">
                    <form onSubmit={handleRegister} className="flex flex-col items-center justify-center h-full px-6 sm:px-12 text-center">
                        <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-slate-900">Create Account</h1>
                      
                        <input 
                            type="text" placeholder="Username" required
                            className="w-full max-w-[320px] bg-slate-100 border-none my-2 py-3 px-4 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            value={regUser} onChange={(e) => setRegUser(e.target.value)} 
                        />
                        <input 
                            type="email" placeholder="Email" required
                            className="w-full max-w-[320px] bg-slate-100 border-none my-2 py-3 px-4 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            value={regEmail} onChange={(e) => setRegEmail(e.target.value)} 
                        />
                       
                        <input 
                            type="text" placeholder="NIC Number" required
                            className="w-full max-w-[320px] bg-slate-100 border-none my-2 py-3 px-4 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            value={regNic} onChange={(e) => setRegNic(e.target.value)} 
                        />
                        <input 
                            type="password" placeholder="Password" required
                            className="w-full max-w-[320px] bg-slate-100 border-none my-2 py-3 px-4 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            value={regPass} onChange={(e) => setRegPass(e.target.value)} 
                        />
                        <button type="submit" className="mt-4 bg-blue-600 text-white rounded-full px-10 py-3 text-xs sm:text-sm font-bold uppercase tracking-widest hover:bg-blue-700 transition-transform active:scale-95">
                            Sign Up
                        </button>

                        {isPanelActive && <p className="text-red-500 text-xs sm:text-sm mt-3 font-medium px-4">{message}</p>}
                    </form>
                </div>

                <div className="form-container sign-in">
                    
                    {isForgotMode ? (
                        <form onSubmit={handleForgotPassword} className="flex flex-col items-center justify-center h-full px-6 sm:px-12 text-center">
                            <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-slate-900">Reset Password</h1>
                            <span className="text-xs sm:text-sm text-slate-500 mb-6 px-4">Enter your email to receive a secure reset link.</span>
                            
                            <input 
                                type="email" placeholder="Email Address" required
                                className="w-full max-w-[320px] bg-slate-100 border-none my-2 py-3 px-4 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} 
                            />
                            <button type="submit" className="mt-4 bg-blue-600 text-white rounded-full px-8 py-3 text-xs sm:text-sm font-bold uppercase tracking-widest hover:bg-blue-700 transition-transform active:scale-95">
                                Send Reset Link
                            </button>
                            
                            <a href="#" className="mt-6 text-sm text-slate-600 hover:text-blue-600 transition-colors" onClick={(e) => { e.preventDefault(); setIsForgotMode(false); setMessage(''); }}>
                                ← Back to Sign In
                            </a>
                            
                            <p className="text-green-600 text-xs sm:text-sm mt-4 font-medium px-4">{message}</p>
                        </form>
                    ) : (
                        <form onSubmit={handleLogin} className="flex flex-col items-center justify-center h-full px-6 sm:px-12 text-center">
                            <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-slate-900">Sign In</h1>
                            
                            <input 
                                type="text" placeholder="Username" required
                                className="w-full max-w-[320px] bg-slate-100 border-none my-2 py-3 px-4 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                value={loginUser} onChange={(e) => setLoginUser(e.target.value)} 
                            />
                            <input 
                                type="password" placeholder="Password" required
                                className="w-full max-w-[320px] bg-slate-100 border-none my-2 py-3 px-4 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                value={loginPass} onChange={(e) => setLoginPass(e.target.value)} 
                            />
                            
                            <a href="#" className="mt-4 mb-2 text-sm text-slate-500 hover:text-blue-600 transition-colors" onClick={(e) => { e.preventDefault(); setIsForgotMode(true); setMessage(''); }}>
                                Forget Your Password?
                            </a>
                            
                            <button type="submit" className="mt-2 bg-blue-600 text-white rounded-full px-12 py-3 text-xs sm:text-sm font-bold uppercase tracking-widest hover:bg-blue-700 transition-transform active:scale-95">
                                Sign In
                            </button>
                            
                            {!isPanelActive && <p className="text-red-500 text-xs sm:text-sm mt-4 font-medium px-4">{message}</p>}
                        </form>
                    )}
                </div>

                <div className="toggle-container">
                    <div className="toggle">
                        <div className="toggle-panel toggle-left flex flex-col items-center justify-center px-6 sm:px-10 text-center">
                            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4">Welcome Back!</h1>
                            <p className="text-sm sm:text-base text-white/90 mb-8 leading-relaxed">Enter your personal details to use all of site features</p>
                            
                            <button className="ghost border-2 border-white text-white rounded-full px-10 py-3 text-xs sm:text-sm font-bold uppercase tracking-widest hover:bg-white/10 transition-colors" onClick={() => { setIsPanelActive(false); setIsForgotMode(false); setMessage(''); }}>
                                Sign In
                            </button>
                        </div>
                        <div className="toggle-panel toggle-right flex flex-col items-center justify-center px-6 sm:px-10 text-center">
                            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4">Welcome!</h1>
                            <p className="text-sm sm:text-base text-white/90 mb-8 leading-relaxed">Register with your personal details to use all of site features</p>
                            <button className="ghost border-2 border-white text-white rounded-full px-10 py-3 text-xs sm:text-sm font-bold uppercase tracking-widest hover:bg-white/10 transition-colors" onClick={() => setIsPanelActive(true)}>
                                Sign Up
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}