import { useState } from 'react';
import { Search, Download, ArrowUpRight, ArrowDownLeft, FileText, Filter } from 'lucide-react';

export default function Statements({ user, myHistory, isDarkMode }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL'); 

 
  const filteredHistory = myHistory.filter((tx) => {
    const isCredit = tx.recipient === user.accountNumber;
    const type = isCredit ? 'CREDIT' : 'DEBIT';
    
    
    if (filterType !== 'ALL' && filterType !== type) return false;
    
    
    const searchLower = searchTerm.toLowerCase();
    return (
      tx.desc.toLowerCase().includes(searchLower) ||
      tx.id.toLowerCase().includes(searchLower) ||
      (tx.sender && tx.sender.toLowerCase().includes(searchLower)) ||
      (tx.recipient && tx.recipient.toLowerCase().includes(searchLower))
    );
  });

  
  const handleDownloadCSV = () => {
    let csvContent = "Date,Reference ID,Description,Counterparty,Type,Amount (USD),Status\n";
    
    filteredHistory.forEach(tx => {
      const isCredit = tx.recipient === user.accountNumber;
      const type = isCredit ? 'CREDIT' : 'DEBIT';
      const counterparty = isCredit ? tx.sender : tx.recipient;
      const amountSign = isCredit ? '+' : '-';
      
      csvContent += `${tx.date},${tx.id},"${tx.desc}",${counterparty},${type},${amountSign}${tx.amount},${tx.status}\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `Vault_Statement_${user.username}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link); 
  };

  return (
    <div className="animate-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto mt-2 sm:mt-4 pb-8">
      
      
      <div className="flex justify-between items-end mb-6 sm:mb-8">
        <div>
          <h2 className={`text-2xl sm:text-3xl font-bold mb-1 sm:mb-2 transition-colors ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Account Statements
          </h2>
          <p className={`text-sm sm:text-base transition-colors ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Search, filter, and export your transaction history.
          </p>
        </div>
        
       
        <button 
          onClick={handleDownloadCSV}
          className={`hidden sm:flex justify-center px-6 py-3 rounded-xl font-bold items-center gap-2 transition-colors shadow-sm ${isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-slate-900 hover:bg-slate-800 text-white'}`}
        >
          <Download size={18} /> Export to CSV
        </button>
      </div>

      
      <div className={`rounded-2xl p-4 sm:p-6 shadow-sm border mb-6 sm:mb-8 flex flex-col lg:flex-row gap-4 items-stretch lg:items-center transition-colors duration-300 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
        
        
        <div className="relative flex-1 w-full">
          <Search className={`absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
          <input 
            type="text" 
            placeholder="Search by description, reference, or name..." 
            className={`w-full pl-10 sm:pl-12 pr-4 py-3 text-sm sm:text-base rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'} border`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        
        <div className={`flex flex-wrap sm:flex-nowrap rounded-xl p-1 border transition-colors ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
          <button 
            onClick={() => setFilterType('ALL')}
            className={`flex-1 sm:flex-none px-3 sm:px-6 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${filterType === 'ALL' ? (isDarkMode ? 'bg-slate-700 text-white shadow-sm' : 'bg-white shadow-sm text-slate-900') : (isDarkMode ? 'text-slate-400 hover:text-slate-300' : 'text-slate-500 hover:text-slate-700')}`}
          >
            All
          </button>
          <button 
            onClick={() => setFilterType('CREDIT')}
            className={`flex-1 sm:flex-none px-3 sm:px-6 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${filterType === 'CREDIT' ? (isDarkMode ? 'bg-slate-700 text-green-400 shadow-sm' : 'bg-white shadow-sm text-green-600') : (isDarkMode ? 'text-slate-400 hover:text-slate-300' : 'text-slate-500 hover:text-slate-700')}`}
          >
            Money In
          </button>
          <button 
            onClick={() => setFilterType('DEBIT')}
            className={`flex-1 sm:flex-none px-3 sm:px-6 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${filterType === 'DEBIT' ? (isDarkMode ? 'bg-slate-700 text-white shadow-sm' : 'bg-white shadow-sm text-slate-900') : (isDarkMode ? 'text-slate-400 hover:text-slate-300' : 'text-slate-500 hover:text-slate-700')}`}
          >
            Money Out
          </button>
        </div>
      </div>

      
      <div className={`rounded-2xl shadow-sm border overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
        
        
        <div className={`hidden sm:grid sm:grid-cols-5 px-4 sm:px-8 py-3 sm:py-4 border-b text-xs font-bold tracking-wider transition-colors ${isDarkMode ? 'bg-slate-900/50 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-100 text-slate-500'}`}>
          <div className="col-span-2">TRANSACTION DETAILS</div>
          <div>COUNTERPARTY</div>
          <div>REFERENCE</div>
          <div className="text-right">AMOUNT</div>
        </div>

        <div className={`divide-y transition-colors ${isDarkMode ? 'divide-slate-800' : 'divide-slate-100'}`}>
          {filteredHistory.length > 0 ? (
            filteredHistory.map((tx) => {
              const isCredit = tx.recipient === user.accountNumber;
              return (
                <div key={tx.id} className={`flex sm:grid sm:grid-cols-5 items-center justify-between px-4 sm:px-8 py-4 sm:py-5 transition-colors ${isDarkMode ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'}`}>
                  
                  
                  <div className="flex items-center gap-3 sm:gap-4 flex-1 sm:col-span-2 min-w-0 pr-4 sm:pr-0">
                    <div className={`p-2 sm:p-3 shrink-0 rounded-xl ${isCredit ? (isDarkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-50 text-green-600') : (isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600')}`}>
                      {isCredit ? <ArrowDownLeft className="w-4 h-4 sm:w-5 sm:h-5" /> : <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5" />}
                    </div>
                    <div className="min-w-0">
                      <p className={`font-bold text-sm sm:text-base truncate ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>{tx.desc}</p>
                      <p className={`text-[10px] sm:text-xs truncate ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>{tx.date}</p>
                    </div>
                  </div>
                  
                  
                  <div className="hidden sm:block sm:col-span-1 min-w-0">
                    <span className={`text-xs sm:text-sm font-medium truncate block ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                      {isCredit ? tx.sender : tx.recipient}
                    </span>
                  </div>

                
                  <div className="hidden sm:block sm:col-span-1 min-w-0">
                    <span className={`text-[10px] sm:text-xs font-mono px-2 py-1 rounded truncate max-w-[120px] lg:max-w-none ${isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-400'}`}>
                      {tx.id}
                    </span>
                  </div>

                
                  <div className={`shrink-0 sm:col-span-1 text-right font-bold text-sm sm:text-lg ${isCredit ? (isDarkMode ? 'text-green-500' : 'text-green-600') : (isDarkMode ? 'text-slate-200' : 'text-slate-900')}`}>
                    {isCredit ? '+' : '-'}${tx.amount.toLocaleString(undefined, {minimumFractionDigits: 2})}
                  </div>

                </div>
              );
            })
          ) : (
            <div className={`px-4 sm:px-8 py-12 flex flex-col items-center justify-center text-center ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>
              <FileText size={48} className="mb-4 opacity-20" />
              <p className="text-sm sm:text-base">No transactions match your filters.</p>
            </div>
          )}
        </div>
      </div>

      
      <button 
        onClick={handleDownloadCSV}
        className={`sm:hidden w-full mt-6 justify-center px-6 py-4 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-sm ${isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-slate-900 hover:bg-slate-800 text-white'}`}
      >
        <Download size={18} /> Export to CSV
      </button>

    </div>
  );
}