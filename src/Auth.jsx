import { useState } from 'react';

export default function Auth({ setLoggedInUser }) {
    const [isPanelActive, setIsPanelActive] = useState(false);
    
    // Login States
    const [loginUser, setLoginUser] = useState('');
    const [loginPass, setLoginPass] = useState('');
    const [showLoginPass, setShowLoginPass] = useState(false);
    
    // Registration States
    const [regUser, setRegUser] = useState('');
    const [regEmail, setRegEmail] = useState('');
    const [regNic, setRegNic] = useState(''); 
    const [regPass, setRegPass] = useState('');
    const [confirmRegPass, setConfirmRegPass] = useState('');
    const [showRegPass, setShowRegPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);
    
    const [message, setMessage] = useState('');
    
    // Password Recovery States
    const [isForgotMode, setIsForgotMode] = useState(false);
    const [forgotEmail, setForgotEmail] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage("Authenticating...");

        try {
            const response = await fetch("https://vault-backend-api-szxu.onrender.com/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ username: loginUser, password: loginPass })
            });
            const data = await response.json();
            
            if (response.ok) {
              
                // Save the secure token and username to the browser's local storage
                localStorage.setItem("token", data.access_token);
                localStorage.setItem("username", data.username);
                
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
        setMessage("");

        // 1. Structural Email Verification
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(regEmail)) {
            setMessage("Error: Please provide a structurally valid email address containing '@' and a domain.");
            return;
        }

        // 2. Cryptographic Strength Length Verification
        if (regPass.length < 8) {
            setMessage("Error: Password must evaluate to at least 8 characters");
            return;
        }

        // 3. Confirm Password Verification Block
        if (regPass !== confirmRegPass) {
            setMessage("Error: The passwords provided do not match. Please verify your entries.");
            return;
        }

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
                
                setRegUser('');
                setRegEmail('');
                setRegNic('');
                setRegPass('');
                setConfirmRegPass('');
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

    
    const EyeIcon = () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
    );
    const EyeOffIcon = () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
    );

    return (
        <div className="bg-[#c9d6ff] bg-gradient-to-r from-[#e2e2e2] to-[#c9d6ff] flex items-center justify-center flex-col h-screen font-['Montserrat',sans-serif] m-0 p-0 box-border max-md:bg-[#ecedef] max-md:bg-[radial-gradient(circle_at_top_center,#ffffff,#9e97bd)] max-md:p-5">
            
            <div className="bg-white rounded-[30px] shadow-[0_5px_15px_rgba(0,0,0,0.35)] relative overflow-hidden w-[768px] max-w-full min-h-[520px] max-md:w-full max-md:h-[85vh] max-md:min-h-[620px] max-md:max-h-[750px]">
                
                {/* Registration View */}
                <div className={`absolute top-0 h-full transition-all duration-[0.6s] ease-in-out left-0 w-1/2 max-md:w-full max-md:h-[66.666%] max-md:top-0 max-md:transition-[all_0.6s_cubic-bezier(0.4,0,0.2,1)]
                    ${isPanelActive 
                        ? 'translate-x-[100%] opacity-100 z-[5] max-md:translate-x-0 max-md:translate-y-0 max-md:opacity-100 max-md:z-[5]' 
                        : 'opacity-0 z-[1] max-md:translate-x-0 max-md:translate-y-[20px] max-md:opacity-0 max-md:z-[1]'}`}>
                    
                    <form onSubmit={handleRegister} className="bg-white flex items-center justify-center flex-col px-10 h-full max-md:px-[30px] max-md:items-start overflow-y-auto">
                        <div className="hidden max-md:flex items-center gap-2 text-[#64748b] text-[11px] font-bold tracking-[1.5px] uppercase mb-[10px]">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                            Secure Enrollment
                        </div>
                        
                        <h1 className="text-2xl font-bold max-md:text-[24px] max-md:text-left max-md:text-[#333] max-md:mb-3 max-md:w-full">Create Account</h1>
                      
                        <input type="text" placeholder="Username" required value={regUser} onChange={(e) => setRegUser(e.target.value)} className="bg-[#eee] border-none my-1.5 py-2 px-[15px] text-[13px] rounded-lg w-full outline-none max-md:bg-[#f8fafc] max-md:border-[1.5px] max-md:border-[#e2e8f0] max-md:rounded-xl max-md:p-3.5 max-md:text-[14px] max-md:my-[4px] focus:max-md:border-[#512da8]" />
                        <input type="email" placeholder="Email" required value={regEmail} onChange={(e) => setRegEmail(e.target.value)} className="bg-[#eee] border-none my-1.5 py-2 px-[15px] text-[13px] rounded-lg w-full outline-none max-md:bg-[#f8fafc] max-md:border-[1.5px] max-md:border-[#e2e8f0] max-md:rounded-xl max-md:p-3.5 max-md:text-[14px] max-md:my-[4px] focus:max-md:border-[#512da8]" />
                        <input type="text" placeholder="NIC Number" required value={regNic} onChange={(e) => setRegNic(e.target.value)} className="bg-[#eee] border-none my-1.5 py-2 px-[15px] text-[13px] rounded-lg w-full outline-none max-md:bg-[#f8fafc] max-md:border-[1.5px] max-md:border-[#e2e8f0] max-md:rounded-xl max-md:p-3.5 max-md:text-[14px] max-md:my-[4px] focus:max-md:border-[#512da8]" />
                        
                        {/* Secure Password Box */}
                        <div className="relative w-full my-1.5 max-md:my-[4px]">
                            <input type={showRegPass ? "text" : "password"} placeholder="Password" required value={regPass} onChange={(e) => setRegPass(e.target.value)} className="bg-[#eee] border-none py-2 pl-[15px] pr-[45px] text-[13px] rounded-lg w-full outline-none max-md:bg-[#f8fafc] max-md:border-[1.5px] max-md:border-[#e2e8f0] max-md:rounded-xl max-md:p-3.5 max-md:text-[14px] focus:max-md:border-[#512da8]" />
                            
                        </div>

                        {/* Confirm Password Box */}
                        <div className="relative w-full my-1.5 max-md:my-[4px]">
                            <input type={showConfirmPass ? "text" : "password"} placeholder="Confirm Password" required value={confirmRegPass} onChange={(e) => setConfirmRegPass(e.target.value)} className="bg-[#eee] border-none py-2 pl-[15px] pr-[45px] text-[13px] rounded-lg w-full outline-none max-md:bg-[#f8fafc] max-md:border-[1.5px] max-md:border-[#e2e8f0] max-md:rounded-xl max-md:p-3.5 max-md:text-[14px] focus:max-md:border-[#512da8]" />
                           
                        </div>
                        
                        <button type="submit" className="bg-[#512da8] text-white text-[12px] py-2.5 px-[45px] border border-transparent rounded-lg font-semibold tracking-[0.5px] uppercase mt-2 cursor-pointer max-md:w-full max-md:rounded-xl max-md:p-4 max-md:text-[14px] max-md:mt-3 shadow-[0_6px_15px_rgba(81,45,168,0.25)]">Sign Up</button>
                        {isPanelActive && <p className="text-red-500 text-[12px] mt-2 text-center max-md:text-left">{message}</p>}
                    </form>
                </div>

                {/* Login and Forgot Password View */}
                <div className={`absolute top-0 h-full transition-all duration-[0.6s] ease-in-out left-0 w-1/2 z-[2] max-md:w-full max-md:h-[66.666%] max-md:top-[33.333%] max-md:transition-[all_0.6s_cubic-bezier(0.4,0,0.2,1)]
                    ${isPanelActive 
                        ? 'translate-x-[100%] max-md:translate-x-0 max-md:-translate-y-[20px] max-md:opacity-0 max-md:pointer-events-none' 
                        : 'max-md:translate-x-0 max-md:translate-y-0 max-md:opacity-100'}`}>
                    
                    {isForgotMode ? (
                        <form onSubmit={handleForgotPassword} className="bg-white flex items-center justify-center flex-col px-10 h-full max-md:px-[30px] max-md:items-start">
                            <div className="hidden max-md:flex items-center gap-2 text-[#64748b] text-[11px] font-bold tracking-[1.5px] uppercase mb-[15px]">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path></svg>
                                Account Recovery
                            </div>
                            
                            <h1 className="text-2xl font-bold max-md:text-[26px] max-md:text-left max-md:text-[#333] max-md:mb-5 max-md:w-full">Reset Password</h1>
                            <span className="mb-5 text-[12px] text-gray-600">Enter your email to receive a secure reset link.</span>
                            
                            <input type="email" placeholder="Email Address" required value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} className="bg-[#eee] border-none my-2 py-2.5 px-[15px] text-[13px] rounded-lg w-full outline-none max-md:bg-[#f8fafc] max-md:border-[1.5px] max-md:border-[#e2e8f0] max-md:rounded-xl max-md:p-4 max-md:text-[14px] max-md:my-[6px] focus:max-md:border-[#512da8]" />
                            <button type="submit" className="bg-[#512da8] text-white text-[12px] py-2.5 px-[45px] border border-transparent rounded-lg font-semibold tracking-[0.5px] uppercase mt-2.5 cursor-pointer max-md:w-full max-md:rounded-xl max-md:p-4 max-md:text-[14px] max-md:mt-5 max-md:shadow-[0_6px_15px_rgba(81,45,168,0.25)]">Send Reset Link</button>
                            
                            <a href="#" onClick={(e) => { e.preventDefault(); setIsForgotMode(false); setMessage(''); }} className="text-[#333] text-[13px] no-underline my-[15px] max-md:w-full max-md:text-right max-md:mt-[5px] max-md:font-semibold max-md:text-[#512da8]">
                                ← Back to Sign In
                            </a>
                            
                            <p className="text-green-600 text-[13px] mt-[15px]">{message}</p>
                        </form>
                    ) : (
                        <form onSubmit={handleLogin} className="bg-white flex items-center justify-center flex-col px-10 h-full max-md:px-[30px] max-md:items-start">
                            <div className="hidden max-md:flex items-center gap-2 text-[#64748b] text-[11px] font-bold tracking-[1.5px] uppercase mb-[15px]">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                                Secure Vault Login
                            </div>
                            
                            <h1 className="text-2xl font-bold max-md:text-[26px] max-md:text-left max-md:text-[#333] max-md:mb-5 max-md:w-full">Sign In</h1>
                            
                            <input type="text" placeholder="Username" required value={loginUser} onChange={(e) => setLoginUser(e.target.value)} className="bg-[#eee] border-none my-2 py-2.5 px-[15px] text-[13px] rounded-lg w-full outline-none max-md:bg-[#f8fafc] max-md:border-[1.5px] max-md:border-[#e2e8f0] max-md:rounded-xl max-md:p-4 max-md:text-[14px] max-md:my-[6px] focus:max-md:border-[#512da8]" />
                            
                            {/* Login Password Container */}
                            <div className="relative w-full my-2 max-md:my-[6px]">
                                <input type={showLoginPass ? "text" : "password"} placeholder="Password" required value={loginPass} onChange={(e) => setLoginPass(e.target.value)} className="bg-[#eee] border-none py-2.5 pl-[15px] pr-[45px] text-[13px] rounded-lg w-full outline-none max-md:bg-[#f8fafc] max-md:border-[1.5px] max-md:border-[#e2e8f0] max-md:rounded-xl max-md:p-4 max-md:text-[14px] focus:max-md:border-[#512da8]" />
                            </div>
                            
                            <a href="#" onClick={(e) => { e.preventDefault(); setIsForgotMode(true); setMessage(''); }} className="text-[#333] text-[13px] no-underline my-[15px] max-md:w-full max-md:text-right max-md:mt-[5px] max-md:font-semibold max-md:text-[#512da8]">
                                Forget Your Password?
                            </a>
                            
                            <button type="submit" className="bg-[#512da8] text-white text-[12px] py-2.5 px-[45px] border border-transparent rounded-lg font-semibold tracking-[0.5px] uppercase mt-2.5 cursor-pointer max-md:w-full max-md:rounded-xl max-md:p-4 max-md:text-[14px] max-md:mt-5 max-md:shadow-[0_6px_15px_rgba(81,45,168,0.25)]">Sign In</button>
                            
                            {!isPanelActive && <p className="text-red-500 text-[13px] mt-[15px]">{message}</p>}
                        </form>
                    )}
                </div>

                {/* Sliding Overlay Panels */}
                <div className={`absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-all duration-[0.6s] ease-in-out z-[1000] rounded-l-[150px] max-md:w-full max-md:h-[33.333%] max-md:left-0 max-md:top-0 max-md:shadow-[0_10px_25px_rgba(0,0,0,0.15)]
                    ${isPanelActive 
                        ? '-translate-x-[100%] rounded-l-none rounded-r-[150px] max-md:translate-x-0 max-md:translate-y-[200%] max-md:rounded-t-none max-md:rounded-b-[30px]' 
                        : 'max-md:rounded-b-none max-md:rounded-t-[30px] max-md:translate-x-0 max-md:translate-y-0'}`}>
                    
                    <div className={`bg-[#512da8] bg-gradient-to-r from-[#5c6bc0] to-[#512da8] text-white relative -left-[100%] h-full w-[200%] transition-all duration-[0.6s] ease-in-out max-md:w-full max-md:h-[200%] max-md:left-0 max-md:-top-[100%]
                        ${isPanelActive 
                            ? 'translate-x-[50%] max-md:translate-x-0 max-md:translate-y-[50%]' 
                            : 'translate-x-0 max-md:translate-x-0 max-md:translate-y-0'}`}>
                        
                        <div className={`absolute w-1/2 h-full flex items-center justify-center flex-col px-[30px] text-center top-0 transition-all duration-[0.6s] ease-in-out max-md:w-full max-md:h-[50%] max-md:left-0
                            ${isPanelActive 
                                ? 'translate-x-0 max-md:translate-x-0 max-md:translate-y-0' 
                                : '-translate-x-[200%] max-md:translate-x-0 max-md:-translate-y-[50px]'}`}>
                            <h1 className="text-2xl font-bold max-md:text-[22px] max-md:mb-[5px]">Welcome Back!</h1>
                            <p className="text-[14px] leading-[20px] tracking-[0.3px] my-5 max-md:text-[13px] max-md:mb-[15px] max-md:mt-[5px] max-md:leading-[18px]">Enter your personal details to use all of site features</p>
                            <button className="bg-transparent text-white text-[12px] py-2.5 px-[45px] border border-white rounded-lg font-semibold tracking-[0.5px] uppercase mt-2.5 cursor-pointer max-md:py-[12px] max-md:px-[35px] max-md:mt-[5px]" onClick={() => { setIsPanelActive(false); setIsForgotMode(false); setMessage(''); }}>
                                Sign In
                            </button>
                        </div>
                        
                        <div className={`absolute w-1/2 h-full flex items-center justify-center flex-col px-[30px] text-center top-0 right-0 transition-all duration-[0.6s] ease-in-out max-md:w-full max-md:h-[50%] max-md:left-0 max-md:right-auto max-md:top-[50%]
                            ${isPanelActive 
                                ? 'translate-x-[200%] max-md:translate-x-0 max-md:translate-y-[50px]' 
                                : 'translate-x-0 max-md:translate-x-0 max-md:translate-y-0'}`}>
                            <h1 className="text-2xl font-bold max-md:text-[22px] max-md:mb-[5px]">Welcome!</h1>
                            <p className="text-[14px] leading-[20px] tracking-[0.3px] my-5 max-md:text-[13px] max-md:mb-[15px] max-md:mt-[5px] max-md:leading-[18px]">Register with your personal details to open a secure account</p>
                            <button className="bg-transparent text-white text-[12px] py-2.5 px-[45px] border border-white rounded-lg font-semibold tracking-[0.5px] uppercase mt-2.5 cursor-pointer max-md:py-[12px] max-md:px-[35px] max-md:mt-[5px]" onClick={() => setIsPanelActive(true)}>
                                Sign Up
                            </button>
                        </div>
                    </div>
                </div>

            </div>

            <div className="mt-[25px] text-[#475569] text-[12px] text-center max-w-[600px] px-[15px] leading-[1.5] z-10">
                ⚠️ <strong>Disclaimer:</strong> This is a simulated application built solely for a university student security project. No real financial, personal, or sensitive data is collected, stored, or processed.
            </div>

        </div>
    );
}