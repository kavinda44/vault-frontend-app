import { useState } from 'react';
import { ShieldCheck, Lock, DollarSign, CheckCircle2, Clock, ArrowUpRight, ArrowDownLeft, MessageSquare } from 'lucide-react';

export default function Transfer({ user, currentBalance, onTransferSuccess, globalHistory, setGlobalHistory, isDarkMode }) {
  const username = user.username;
  const accountNumber = user.accountNumber;
  
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState(''); 
  const [transferStatus, setTransferStatus] = useState('');
  const [encryptedPayload, setEncryptedPayload] = useState('');
  
  const [isOtpMode, setIsOtpMode] = useState(false);
  const [otpCode, setOtpCode] = useState('');

  const handleRequestTransfer = async (e) => {
    e.preventDefault();
    setTransferStatus("Generating secure OTP...");
    
    try {
      const response = await fetch("https://vault-backend-api-szxu.onrender.com/transfer/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username, recipient_account: recipient, amount: amount })
      });

      if (response.ok) {
        setTransferStatus(" OTP sent to your registered email.");
        setIsOtpMode(true); 
      } else {
        const errorData = await response.json();
        setTransferStatus(" Failed: " + errorData.detail);
      }
    } catch (error) {
      setTransferStatus(" Network error.");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setTransferStatus("Verifying 2FA Code & Encrypting Payload...");
    setEncryptedPayload('');

    try {
      const response = await fetch("https://vault-backend-api-szxu.onrender.com/transfer/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username, otp: otpCode })
      });

      const data = await response.json();

      if (response.ok) {
        setTransferStatus(" " + data.message);
        setEncryptedPayload(data.raw_encrypted_payload);
        
        onTransferSuccess(parseFloat(amount));
        
        const newTx = {
            id: `TRX-${Math.floor(10000 + Math.random() * 90000)}`,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            sender: username,
            recipient: recipient,
            amount: parseFloat(amount),
            desc: description || 'Funds Transfer', 
            status: 'Settled'
        };
        setGlobalHistory(prev => [newTx, ...prev]);
        
        setAmount('');
        setRecipient('');
        setDescription('');
        setOtpCode('');
        setIsOtpMode(false);
      } else {
        setTransferStatus(" Error: " + data.detail);
      }
    } catch (error) {
      setTransferStatus(" Network error.");
    }
  };

  const myHistory = globalHistory.filter(tx => tx.sender === username || tx.recipient === accountNumber);

  return (
    <div className="animate-in slide-in-from-right-8 duration-500 max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className={`text-3xl font-bold mb-2 transition-colors ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
          Secure Funds Transfer
        </h2>
        <p className={`transition-colors ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Initiate a highly secure, transaction to your account.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* TRANSFER FORM CARD */}
        <div className={`rounded-2xl p-8 shadow-sm border h-fit transition-colors duration-300 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
          <h3 className={`text-lg font-bold mb-6 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
            <ArrowUpRight className="text-blue-500" size={20} /> New Transfer
          </h3>

          {isOtpMode ? (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="text-center mb-6">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${isDarkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                  <ShieldCheck size={32} />
                </div>
                <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Two-Factor Authentication</h3>
              </div>

              <div>
                <label className={`block text-xs font-bold tracking-wider mb-2 text-center ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>SECURE OTP CODE</label>
                <input 
                  type="text" maxLength="6"
                  className={`w-full px-4 py-4 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-mono text-center text-3xl tracking-[0.5em] transition-colors ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-600' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-300'}`}
                  value={otpCode} onChange={(e) => setOtpCode(e.target.value)} required 
                  placeholder="------"
                />
              </div>
              
              <button type="submit" className="w-full bg-green-600 text-white py-4 rounded-xl font-bold hover:bg-green-700 transition-colors flex items-center justify-center gap-2 text-lg shadow-sm">
                <CheckCircle2 size={20} /> Authorize & Encrypt Payload
              </button>
            </form>
          ) : (
            <form onSubmit={handleRequestTransfer} className="space-y-6">
              <div>
                <label className={`block text-xs font-bold tracking-wider mb-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>RECIPIENT ACCOUNT NUMBER</label>
                <input 
                  type="text" 
                  className={`w-full px-4 py-4 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-mono text-lg border transition-colors ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'}`}
                  value={recipient} onChange={(e) => setRecipient(e.target.value)} required 
                  placeholder="e.g. ACC-10293"
                />
              </div>
              
              <div>
                <label className={`block text-xs font-bold tracking-wider mb-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>DESCRIPTION / MEMO</label>
                <div className="relative">
                  <MessageSquare className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} size={20} />
                  <input 
                    type="text" 
                    className={`w-full pl-12 pr-4 py-4 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-lg border transition-colors ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'}`}
                    value={description} onChange={(e) => setDescription(e.target.value)} required 
                    placeholder="Description"
                  />
                </div>
              </div>

              <div>
                <label className={`block text-xs font-bold tracking-wider mb-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>TRANSFER AMOUNT (USD)</label>
                <div className="relative">
                  <DollarSign className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} size={20} />
                  <input 
                    type="number" step="0.01" 
                    className={`w-full pl-12 pr-4 py-4 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-mono text-xl border transition-colors ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'}`}
                    value={amount} onChange={(e) => setAmount(e.target.value)} required 
                    placeholder="0.00"
                  />
                </div>
                <p className={`text-xs mt-2 text-right ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Available Balance: ${currentBalance.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
              </div>
              
              <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-lg shadow-sm">
               Proceed
              </button>
            </form>
          )}

          {transferStatus && (
            <div className={`mt-6 p-4 rounded-xl border text-sm font-medium ${transferStatus.includes('✅') ? (isDarkMode ? 'bg-green-900/30 border-green-800 text-green-400' : 'bg-green-50 border-green-200 text-green-700') : transferStatus.includes('❌') || transferStatus.includes('Failed') || transferStatus.includes('Error') ? (isDarkMode ? 'bg-red-900/30 border-red-800 text-red-400' : 'bg-red-50 border-red-200 text-red-700') : (isDarkMode ? 'bg-blue-900/30 border-blue-800 text-blue-400' : 'bg-blue-50 border-blue-200 text-blue-700')}`}>
              {transferStatus}
            </div>
          )}

          {encryptedPayload && (
            <div className={`mt-4 p-4 rounded-xl border ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-900 border-slate-900'}`}>
              <p className="text-[10px] text-green-400 font-mono mb-2 uppercase tracking-widest">System Log - AES-256 Ciphertext:</p>
              <p className="text-xs text-green-300 font-mono break-all leading-relaxed">{encryptedPayload}</p>
            </div>
          )}
        </div>

        {/* TRANSACTION LOG CARD */}
        <div className="flex flex-col gap-6">
          <div className={`rounded-2xl p-8 shadow-sm border flex-1 transition-colors duration-300 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
            <h3 className={`text-lg font-bold mb-6 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
              <Clock className={isDarkMode ? 'text-slate-500' : 'text-slate-400'} size={20} /> My Transaction Log
            </h3>
            
            <div className="space-y-4">
              {myHistory.map((tx, index) => {
                const isCredit = tx.recipient === accountNumber;
                return (
                  <div key={index} className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${isDarkMode ? 'border-slate-800 hover:bg-slate-800/50' : 'border-slate-100 hover:bg-slate-50'}`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isCredit ? (isDarkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-50 text-green-600') : (isDarkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-50 text-blue-600')}`}>
                        {isCredit ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                      </div>
                      <div>
                        <p className={`font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>{tx.desc}</p>
                        <p className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>{tx.date} • {isCredit ? `From: ${tx.sender}` : `To: ${tx.recipient}`}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${isCredit ? 'text-green-500' : (isDarkMode ? 'text-slate-200' : 'text-slate-900')}`}>
                        {isCredit ? '+' : '-'}${tx.amount.toLocaleString(undefined, {minimumFractionDigits: 2})}
                      </p>
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${tx.status === 'Just Now' ? 'text-blue-500' : 'text-slate-400'}`}>
                        {tx.status}
                      </span>
                    </div>
                  </div>
                );
              })}
              {myHistory.length === 0 && (
                <div className={`py-8 text-center text-sm ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>No recent transfers found.</div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}