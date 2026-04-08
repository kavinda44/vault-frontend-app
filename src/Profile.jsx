import { useState } from 'react';
import { User, Lock, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

export default function Profile({ user, onUpdateUser, isDarkMode }) {
  const [username, setUsername] = useState(user.username || '');
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState('');

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setStatus("Processing secure update...");

    // 1. Smarter Frontend Validation
    if (newPassword && newPassword !== confirmPassword) {
      setStatus(" Error: New passwords do not match.");
      return;
    }

    if (newPassword && !currentPassword) {
      setStatus(" Error: You must enter your current password to set a new one.");
      return;
    }

    // 2. API Call
    try {
      const response = await fetch("https://vault-backend-api-szxu.onrender.com/user/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            current_username: user.username,
            new_username: username,          
            current_password: currentPassword, 
            new_password: newPassword 
        })
      });

      const data = await response.json();

      if (response.ok) {
        onUpdateUser({
          ...user,
          username: username
        });

        setStatus(`✅ ${data.message}`);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setStatus(` Error: ${data.detail}`);
      }
    } catch (error) {
      console.error("Backend connection error:", error);
      setStatus(" Critical Error: Could not connect to backend server.");
    }
  };

  return (
    <div className="animate-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto mt-4">
      
      {/* HEADER SECTION */}
      <div className="mb-8 flex items-center gap-4">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center border-4 shadow-sm overflow-hidden transition-colors ${isDarkMode ? 'bg-orange-900/30 border-slate-950 text-orange-400' : 'bg-orange-100 border-white text-orange-500'}`}>
           <User size={32} />
        </div>
        <div>
          <h2 className={`text-3xl font-bold mb-1 transition-colors ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            User Profile
          </h2>
          <p className={`transition-colors ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Manage your account credentials and security settings.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* LEFT FORM COLUMN */}
        <div className={`md:col-span-2 rounded-2xl p-8 shadow-sm border transition-colors duration-300 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
          <h3 className={`text-lg font-bold mb-6 border-b pb-4 transition-colors ${isDarkMode ? 'text-white border-slate-800' : 'text-slate-800 border-slate-100'}`}>
            Account Credentials
          </h3>
          
          <form onSubmit={handleUpdateProfile} className="space-y-6">
            
            {/* Display Name Input */}
            <div>
              <label className={`block text-xs font-bold tracking-wider mb-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>DISPLAY NAME</label>
              <div className="relative">
                <User className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} size={20} />
                <input 
                  type="text" 
                  className={`w-full pl-12 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium transition-colors ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900'} border`}
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                  required 
                />
              </div>
            </div>

            {/* Security Section */}
            <div className={`pt-4 border-t transition-colors ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
              <label className={`block text-xs font-bold tracking-wider mb-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>CURRENT PASSWORD</label>
              <div className="relative mb-4">
                <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} size={20} />
                <input 
                  type="password" 
                  className={`w-full pl-12 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-colors border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'}`}
                  value={currentPassword} 
                  onChange={(e) => setCurrentPassword(e.target.value)} 
                  placeholder="Enter current password"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-bold tracking-wider mb-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>NEW PASSWORD</label>
                  <input 
                    type="password" 
                    className={`w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-colors border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'}`}
                    value={newPassword} 
                    onChange={(e) => setNewPassword(e.target.value)} 
                    placeholder="Enter new password"
                  />
                </div>
                <div>
                  <label className={`block text-xs font-bold tracking-wider mb-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>CONFIRM NEW</label>
                  <input 
                    type="password" 
                    className={`w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-colors border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'}`}
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
            </div>
            
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-sm">
              <ShieldCheck size={20} /> Update Profile
            </button>
          </form>

          {/* STATUS MESSAGE */}
          {status && (
            <div className={`mt-6 p-4 rounded-xl border text-sm font-medium flex items-start gap-3 transition-colors ${status.includes('✅') ? (isDarkMode ? 'bg-green-900/30 border-green-800 text-green-400' : 'bg-green-50 border-green-200 text-green-700') : (isDarkMode ? 'bg-red-900/30 border-red-800 text-red-400' : 'bg-red-50 border-red-200 text-red-700')}`}>
              {status.includes('✅') ? <CheckCircle2 size={20} className="shrink-0" /> : <AlertCircle size={20} className="shrink-0" />}
              <p>{status}</p>
            </div>
          )}
        </div>

        {/* RIGHT INFO COLUMN */}
        <div className={`rounded-2xl p-6 border h-fit transition-colors duration-300 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
          <h3 className={`text-sm font-bold tracking-wider uppercase mb-4 ${isDarkMode ? 'text-slate-300' : 'text-slate-800'}`}>Database Profile</h3>
          
          <div className="space-y-4">
            <div>
              <p className={`text-xs font-bold tracking-wider mb-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>ACCOUNT NUMBER</p>
              <p className={`font-mono font-medium px-3 py-2 rounded-lg border transition-colors ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-white border-slate-200 text-slate-900'}`}>
                {user.accountNumber}
              </p>
            </div>
            <div>
              <p className={`text-xs font-bold tracking-wider mb-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>ACCOUNT STATUS</p>
              <p className={`text-sm font-bold flex items-center gap-1 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                <CheckCircle2 size={14} /> Verified Active
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}