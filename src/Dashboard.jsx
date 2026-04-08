import { useState, useEffect } from 'react';
import { 
  LayoutGrid, ArrowLeftRight, ShieldCheck, LogOut, 
  Search, Lock, Bell, User, DollarSign, CheckCircle2, X, 
  ArrowUpRight, ArrowDownLeft, FileText, Settings as SettingsIcon,
  Moon, Sun, Menu // <-- Added Menu icon for mobile
} from 'lucide-react';

import Transfer from './Transfer';
import Statements from './Statements'; 
import Profile from './Profile'; 
import Settings from './Settings'; 

export default function Dashboard({ user, handleLogout }) {
  
  // --- USER PROFILE STATE ---
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem(`vault_profile_${user.accountNumber}`);
    if (saved) return JSON.parse(saved);
    return user; 
  });

  useEffect(() => {
    localStorage.setItem(`vault_profile_${currentUser.accountNumber}`, JSON.stringify(currentUser));
  }, [currentUser]);

  // --- DARK MODE STATE ---
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('vault_dark_mode');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('vault_dark_mode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  // --- MOBILE MENU STATE ---
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const username = currentUser.username;
  const accountNumber = currentUser.accountNumber;
  const [currentBalance, setCurrentBalance] = useState(currentUser.balance);

  const [activePage, setActivePage] = useState('home'); 
  
  const [globalHistory, setGlobalHistory] = useState(() => {
    const saved = localStorage.getItem(`vault_global_history`);
    if (saved) return JSON.parse(saved);
    return []; 
  });

  useEffect(() => {
    localStorage.setItem(`vault_global_history`, JSON.stringify(globalHistory));
  }, [globalHistory]);

  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [modalRecipient, setModalRecipient] = useState('');
  const [modalAmount, setModalAmount] = useState('');
  const [modalDesc, setModalDesc] = useState('');
  const [modalStatus, setModalStatus] = useState('');
  const [modalPayload, setModalPayload] = useState('');
  const [modalOtpMode, setModalOtpMode] = useState(false);
  const [modalOtpCode, setModalOtpCode] = useState('');

  const myHistory = globalHistory.filter(tx => tx.sender === username || tx.recipient === accountNumber);

  const navigateTo = (page) => {
    setActivePage(page);
    setIsTransferModalOpen(false);
    setIsMobileMenuOpen(false); // Close mobile menu on navigation
  };

  const handleModalRequestTransfer = async (e) => {
    e.preventDefault();
    setModalStatus("Generating secure OTP...");
    try {
      const response = await fetch("https://vault-backend-api-szxu.onrender.com/transfer/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username, recipient_account: modalRecipient, amount: modalAmount })
      });
      if (response.ok) {
        setModalStatus("OTP sent to your registered email.");
        setModalOtpMode(true); 
      } else {
        const errorData = await response.json();
        setModalStatus("Failed: " + errorData.detail);
      }
    } catch (error) {
      setModalStatus("Network error.");
    }
  };

  const handleModalVerifyOtp = async (e) => {
    e.preventDefault();
    setModalStatus("Verifying 2FA Code & Encrypting Payload...");
    setModalPayload('');
    try {
      const response = await fetch("https://vault-backend-api-szxu.onrender.com/transfer/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username, otp: modalOtpCode })
      });
      const data = await response.json();
      if (response.ok) {
        setModalStatus(" " + data.message);
        setModalPayload(data.raw_encrypted_payload);
        setCurrentBalance(prev => prev - parseFloat(modalAmount));
        
        const newTx = {
            id: `TRX-${Math.floor(10000 + Math.random() * 90000)}`,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            sender: username,
            recipient: modalRecipient,
            amount: parseFloat(modalAmount),
            desc: modalDesc || 'Quick Transfer',
            status: 'Settled'
        };
        setGlobalHistory(prevHistory => [newTx, ...prevHistory]);
        
        setModalAmount('');
        setModalRecipient('');
        setModalDesc('');
        setModalOtpCode('');
        setModalOtpMode(false);
      } else {
        setModalStatus(" Error: " + data.detail);
      }
    } catch (error) {
      setModalStatus(" Network error.");
    }
  };

  return (
    <div className={`flex h-screen font-sans transition-colors duration-300 overflow-hidden ${isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-[#f8f9fc] text-slate-800'}`}>
      
      {/* MOBILE OVERLAY */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden" 
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside className={`fixed md:relative w-64 h-full border-r flex flex-col justify-between z-50 transition-all duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="overflow-y-auto">
          <div className={`p-6 border-b flex items-center justify-between ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
            <div>
              <h1 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Digital Vault</h1>
              <p className={`text-sm mt-1 truncate ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Hi, {username}</p>
            </div>
            {/* Close button for mobile */}
            <button className="md:hidden p-1 rounded-lg" onClick={() => setIsMobileMenuOpen(false)}>
              <X size={24} className={isDarkMode ? 'text-slate-400' : 'text-slate-500'} />
            </button>
          </div>
          
          <nav className="p-4 space-y-2">
            <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('home'); }} className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activePage === 'home' ? (isDarkMode ? 'text-blue-400 bg-blue-900/30' : 'text-blue-600 bg-blue-50') : (isDarkMode ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-50')}`}>
              <LayoutGrid size={20} /> Home
            </a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('transfers'); }} className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activePage === 'transfers' ? (isDarkMode ? 'text-blue-400 bg-blue-900/30' : 'text-blue-600 bg-blue-50') : (isDarkMode ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-50')}`}>
              <ArrowLeftRight size={20} /> Transfers
            </a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('statements'); }} className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activePage === 'statements' ? (isDarkMode ? 'text-blue-400 bg-blue-900/30' : 'text-blue-600 bg-blue-50') : (isDarkMode ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-50')}`}>
              <FileText size={20} /> Statements
            </a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('settings'); }} className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activePage === 'settings' ? (isDarkMode ? 'text-blue-400 bg-blue-900/30' : 'text-blue-600 bg-blue-50') : (isDarkMode ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-50')}`}>
              <SettingsIcon size={20} /> Settings
            </a>
          </nav>
        </div>

        <div className="p-4">
          <button onClick={handleLogout} className={`flex items-center gap-3 px-4 py-3 w-full rounded-xl font-medium transition-colors ${isDarkMode ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-50'}`}>
            <LogOut size={20} /> Logout
          </button>
          <button onClick={() => { setIsMobileMenuOpen(false); setIsTransferModalOpen(true); }} className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium shadow-sm transition-colors">
            Quick Transfer
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        
        {/* HEADER */}
        <header className={`h-16 sm:h-20 border-b flex items-center justify-between px-4 sm:px-8 shrink-0 transition-colors duration-300 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center gap-2 sm:gap-4">
            <button className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu size={24} className={isDarkMode ? 'text-slate-200' : 'text-slate-700'} />
            </button>
            <h2 className={`text-lg sm:text-xl font-bold truncate ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Vault Financial</h2>
            <div className={`hidden sm:flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-wide ${isDarkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-50 text-green-700'}`}>
              <div className="w-2 h-2 rounded-full bg-green-500"></div> SECURE
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 sm:p-2.5 rounded-full transition-colors duration-300 ${isDarkMode ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDarkMode ? <Sun size={18} className="sm:w-5 sm:h-5" /> : <Moon size={18} className="sm:w-5 sm:h-5" />}
            </button>
            
            <div 
              onClick={() => navigateTo('profile')}
              className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border-2 shadow-sm overflow-hidden cursor-pointer hover:ring-2 hover:ring-orange-300 transition-all ${isDarkMode ? 'bg-orange-900/30 border-slate-800' : 'bg-orange-100 border-white'}`}
              title="Profile Settings"
            >
               <User className="text-orange-500 w-4 h-4 sm:w-6 sm:h-6" />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 sm:p-8 relative">
          
          {activePage === 'home' && (
            <div className="animate-in fade-in duration-500">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                
                {/* AVAILABLE LIQUIDITY CARD */}
                <div className={`col-span-1 lg:col-span-2 rounded-2xl p-6 sm:p-8 shadow-sm border relative overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
                  <p className={`text-xs font-bold tracking-wider mb-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>AVAILABLE LIQUIDITY</p>
                  <div className="flex items-end gap-3 mb-6">
                    <h1 className={`text-4xl sm:text-5xl font-extrabold truncate ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      ${currentBalance.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                    </h1>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-8">
                    <span className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Digital Vault Account</span>
                    <span className={`px-3 py-1 rounded text-sm font-mono tracking-widest w-fit ${isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>{accountNumber}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 z-10 relative">
                    <button onClick={() => setIsTransferModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-medium shadow-sm transition-colors flex items-center justify-center gap-2">
                      <ArrowLeftRight size={18} /> Quick Transfer
                    </button>
                    <button onClick={() => navigateTo('statements')} className={`px-6 py-3 rounded-full font-medium transition-colors ${isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}>
                      View Statements 
                    </button>
                  </div>
                  
                  <div className={`hidden sm:flex absolute bottom-0 right-8 w-64 h-32 items-end gap-2 ${isDarkMode ? 'opacity-20' : 'opacity-50'}`}>
                    <div className="w-full bg-blue-100 rounded-t-sm h-1/6"></div>
                    <div className="w-full bg-blue-100 rounded-t-sm h-1/5"></div>
                    <div className="w-full bg-blue-100 rounded-t-sm h-1/3"></div>
                    <div className="w-full bg-blue-200 rounded-t-sm h-3/4"></div>
                    <div className="w-full bg-blue-300 rounded-t-sm h-full"></div>
                  </div>
                </div>

                {/* CASH FLOW CARD */}
                {(() => {
                  const actualTotalIncome = myHistory.filter(tx => tx.recipient === accountNumber).reduce((sum, tx) => sum + tx.amount, 0);
                  const actualTotalExpenses = myHistory.filter(tx => tx.sender === username).reduce((sum, tx) => sum + tx.amount, 0);
                  const totalVolume = actualTotalIncome + actualTotalExpenses;
                  
                  const incomePct = totalVolume > 0 ? (actualTotalIncome / totalVolume) * 100 : 0;
                  const expensePct = totalVolume > 0 ? (actualTotalExpenses / totalVolume) * 100 : 0;

                  const strokeWidth = 10;
                  const radius = 40;
                  const circumference = 2 * Math.PI * radius; 
                  
                  const gap = (actualTotalIncome > 0 && actualTotalExpenses > 0) ? 14 : 0;
                  const incomeLength = (incomePct / 100) * circumference;
                  const expenseLength = (expensePct / 100) * circumference;
                  
                  const incomeStroke = Math.max(0, incomeLength - gap);
                  const expenseStroke = Math.max(0, expenseLength - gap);
                  const expenseOffset = -incomeLength; 

                  return (
                    <div className={`rounded-2xl p-6 sm:p-8 shadow-sm border flex flex-col justify-between relative overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className={`text-xs font-bold tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>CASH FLOW</h3>
                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>Live</span>
                      </div>
                      
                      <div className="flex-1 flex items-center justify-center py-4 relative">
                        <div className={`absolute w-28 h-28 rounded-full blur-xl ${isDarkMode ? 'bg-slate-800 opacity-50' : 'bg-slate-100 opacity-80'}`}></div>
                        
                        <svg viewBox="0 0 100 100" className="w-32 h-32 sm:w-40 sm:h-40 transform -rotate-90 relative z-10 drop-shadow-sm">
                          <circle cx="50" cy="50" r={radius} fill="transparent" stroke={isDarkMode ? '#1e293b' : '#f1f5f9'} strokeWidth={strokeWidth} />
                          
                          {actualTotalIncome > 0 && (
                            <circle 
                              cx="50" cy="50" r={radius} 
                              fill="transparent" 
                              stroke="#10b981" 
                              strokeWidth={strokeWidth} 
                              strokeLinecap="round"
                              strokeDasharray={`${incomeStroke} ${circumference}`}
                              strokeDashoffset="0"
                              className="transition-all duration-1000 ease-out"
                            />
                          )}

                          {actualTotalExpenses > 0 && (
                            <circle 
                              cx="50" cy="50" r={radius} 
                              fill="transparent" 
                              stroke="#ef4444" 
                              strokeWidth={strokeWidth} 
                              strokeLinecap="round"
                              strokeDasharray={`${expenseStroke} ${circumference}`}
                              strokeDashoffset={expenseOffset}
                              className="transition-all duration-1000 ease-out"
                            />
                          )}
                        </svg>

                        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none mt-1">
                          <span className={`text-2xl sm:text-3xl font-extrabold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{myHistory.length}</span>
                          <span className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Trx</span>
                        </div>
                      </div>

                      <div className={`flex justify-between items-end pt-4 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                        <div>
                          <div className="flex items-center gap-1 sm:gap-2 mb-1">
                            <div className={`w-2 h-2 rounded-full ${totalVolume > 0 ? 'bg-emerald-500' : (isDarkMode ? 'bg-slate-700' : 'bg-slate-300')}`}></div>
                            <p className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Inflow</p>
                          </div>
                          <p className="text-sm font-bold text-green-500 truncate max-w-[80px] sm:max-w-none">
                            +${actualTotalIncome.toLocaleString(undefined, {minimumFractionDigits: 0})}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center justify-end gap-1 sm:gap-2 mb-1">
                            <p className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Outflow</p>
                            <div className={`w-2 h-2 rounded-full ${totalVolume > 0 ? 'bg-red-500' : (isDarkMode ? 'bg-slate-700' : 'bg-slate-300')}`}></div>
                          </div>
                          <p className="text-sm font-bold text-red-500 truncate max-w-[80px] sm:max-w-none">
                            -${actualTotalExpenses.toLocaleString(undefined, {minimumFractionDigits: 0})}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })()}

              </div>

              <h2 className={`text-lg sm:text-xl font-bold mb-4 sm:mb-6 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Recent Activity</h2>
              
              {/* RECENT ACTIVITY LIST (Converted to Flexbox for superior mobile scaling) */}
              <div className={`rounded-2xl shadow-sm border overflow-hidden mb-12 transition-colors duration-300 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
                <div className={`divide-y ${isDarkMode ? 'divide-slate-800' : 'divide-slate-100'}`}>
                  {myHistory.map((tx) => {
                    const isCredit = tx.recipient === accountNumber;
                    return (
                      <div key={tx.id} className={`flex items-center justify-between px-4 sm:px-8 py-4 sm:py-5 transition-colors ${isDarkMode ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'}`}>
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className={`p-2 rounded-lg shrink-0 ${isCredit ? (isDarkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-50 text-green-600') : (isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600')}`}>
                            {isCredit ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                          </div>
                          <div className="min-w-0">
                            <span className={`font-bold text-sm sm:text-base block truncate ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>{tx.desc}</span>
                            <span className={`text-xs block truncate ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>{tx.date} • {isCredit ? `From: ${tx.sender}` : `To: ${tx.recipient}`}</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end justify-center ml-2 shrink-0">
                          <div className={`text-sm sm:text-base font-bold ${isCredit ? 'text-green-500' : (isDarkMode ? 'text-slate-200' : 'text-slate-900')}`}>
                            {isCredit ? '+' : '-'}${tx.amount.toLocaleString(undefined, {minimumFractionDigits: 2})}
                          </div>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold mt-1 ${isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'}`}>
                            {tx.status}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                  {myHistory.length === 0 && (
                     <div className={`px-4 sm:px-8 py-8 text-center text-sm ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>No recent transactions found.</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activePage === 'transfers' && (
            <Transfer 
              user={currentUser} 
              currentBalance={currentBalance} 
              globalHistory={globalHistory}
              setGlobalHistory={setGlobalHistory}
              onTransferSuccess={(amountDeducted) => setCurrentBalance(prev => prev - amountDeducted)} 
              isDarkMode={isDarkMode}
            />
          )}

          {activePage === 'statements' && (
            <Statements 
              user={currentUser} 
              myHistory={myHistory} 
              isDarkMode={isDarkMode}
            />
          )}

          {activePage === 'profile' && (
            <Profile 
              user={currentUser} 
              onUpdateUser={setCurrentUser} 
              isDarkMode={isDarkMode}
            />
          )}

          {activePage === 'settings' && (
            <Settings 
              isDarkMode={isDarkMode} 
              toggleDarkMode={() => setIsDarkMode(!isDarkMode)} 
            />
          )}

        </div>
      </main>

      {/* QUICK TRANSFER MODAL */}
      {isTransferModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className={`w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative transition-colors duration-300 ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white'}`}>
            <button onClick={() => setIsTransferModalOpen(false)} className={`absolute top-4 right-4 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}><X size={24} /></button>
            <div className="p-6 sm:p-8">
              <h2 className={`text-xl sm:text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Quick Transfer</h2>
              
              {modalOtpMode ? (
                <form onSubmit={handleModalVerifyOtp} className="space-y-4 mt-6">
                  <div>
                    <label className={`block text-xs font-bold tracking-wider mb-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>ENTER 6-DIGIT OTP</label>
                    <input type="text" maxLength="6" className={`w-full px-4 py-3 rounded-xl text-center text-xl sm:text-2xl tracking-widest outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-600' : 'bg-slate-50 border-slate-200 text-slate-900'} border`} value={modalOtpCode} onChange={(e) => setModalOtpCode(e.target.value)} required placeholder="------" />
                  </div>
                  <button type="submit" className="w-full mt-4 bg-green-600 text-white py-3 rounded-xl font-bold flex justify-center"><CheckCircle2 size={18} className="mr-2" /> Confirm</button>
                </form>
              ) : (
                <form onSubmit={handleModalRequestTransfer} className="space-y-4 mt-6">
                  <input type="text" className={`w-full px-4 py-3 text-sm sm:text-base rounded-xl outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900'} border`} value={modalRecipient} onChange={(e) => setModalRecipient(e.target.value)} required placeholder="Recipient ACC-XXXXXX" />
                  <input type="text" className={`w-full px-4 py-3 text-sm sm:text-base rounded-xl outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900'} border`} value={modalDesc} onChange={(e) => setModalDesc(e.target.value)} required placeholder="Description (e.g. Rent)" />
                  <input type="number" step="0.01" className={`w-full px-4 py-3 text-sm sm:text-base rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-mono ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900'} border`} value={modalAmount} onChange={(e) => setModalAmount(e.target.value)} required placeholder="Amount (USD)" />
                  <button type="submit" className="w-full mt-4 bg-blue-600 hover:bg-blue-700 transition-colors text-white py-3 rounded-xl font-bold flex justify-center">Transfer</button>
                </form>
              )}
              {modalStatus && <p className={`mt-6 text-sm font-bold text-center ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{modalStatus}</p>}
              {modalPayload && <div className={`mt-4 p-4 rounded-xl border overflow-x-auto ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-900'}`}><p className="text-[10px] text-green-400 font-mono mb-2 uppercase tracking-widest">System Log - Ciphertext:</p><p className="text-xs text-green-300 font-mono break-all leading-relaxed">{modalPayload}</p></div>}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}