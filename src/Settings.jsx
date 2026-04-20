import { useState } from 'react';
import { Moon, Sun, Bell, Shield, Smartphone, Mail, Key } from 'lucide-react';

export default function Settings({ isDarkMode, toggleDarkMode }) {

  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [twoFactor, setTwoFactor] = useState(true);


  const ToggleSwitch = ({ enabled, onChange }) => (
    <button 
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-300 focus:outline-none ${enabled ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'}`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-300 ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  );

  return (
    <div className="animate-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto mt-2 sm:mt-4">
      
      <div className="mb-6 sm:mb-8">
        <h2 className={`text-2xl sm:text-3xl font-bold mb-1 sm:mb-2 transition-colors ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
          Preferences & Settings
        </h2>
        <p className={`text-sm sm:text-base transition-colors ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          Customize your dashboard appearance and notification preferences.
        </p>
      </div>

      <div className="space-y-4 sm:space-y-6">
        
       
        <div className={`rounded-2xl p-5 sm:p-8 shadow-sm border transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
          <h3 className={`text-xs sm:text-sm font-bold tracking-wider uppercase mb-4 sm:mb-6 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Appearance</h3>
          
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
              <div className={`p-2.5 sm:p-3 shrink-0 rounded-xl ${isDarkMode ? 'bg-slate-800 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                {isDarkMode ? <Moon className="w-5 h-5 sm:w-6 sm:h-6" /> : <Sun className="w-5 h-5 sm:w-6 sm:h-6" />}
              </div>
              <div className="min-w-0">
                <p className={`text-sm sm:text-base font-bold truncate ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Dark Mode</p>
                <p className={`text-xs sm:text-sm mt-0.5 sm:mt-0 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Switch to a dark theme for low-light environments.</p>
              </div>
            </div>
            <ToggleSwitch enabled={isDarkMode} onChange={toggleDarkMode} />
          </div>
        </div>

        
        <div className={`rounded-2xl p-5 sm:p-8 shadow-sm border transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
          <h3 className={`text-xs sm:text-sm font-bold tracking-wider uppercase mb-4 sm:mb-6 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Notifications</h3>
          
          <div className="space-y-5 sm:space-y-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                <div className={`p-2.5 sm:p-3 shrink-0 rounded-xl ${isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-50 text-slate-600'}`}>
                  <Mail className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="min-w-0">
                  <p className={`text-sm sm:text-base font-bold truncate ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Email Alerts</p>
                  <p className={`text-xs sm:text-sm mt-0.5 sm:mt-0 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Receive emails for large transactions and logins.</p>
                </div>
              </div>
              <ToggleSwitch enabled={emailAlerts} onChange={() => setEmailAlerts(!emailAlerts)} />
            </div>

            <div className={`border-t pt-5 sm:pt-6 ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  <div className={`p-2.5 sm:p-3 shrink-0 rounded-xl ${isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-50 text-slate-600'}`}>
                    <Smartphone className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div className="min-w-0">
                    <p className={`text-sm sm:text-base font-bold truncate ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>SMS Alerts</p>
                    <p className={`text-xs sm:text-sm mt-0.5 sm:mt-0 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Get text messages for security codes and transfers.</p>
                  </div>
                </div>
                <ToggleSwitch enabled={smsAlerts} onChange={() => setSmsAlerts(!smsAlerts)} />
              </div>
            </div>
          </div>
        </div>

        
        <div className={`rounded-2xl p-5 sm:p-8 shadow-sm border transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
          <h3 className={`text-xs sm:text-sm font-bold tracking-wider uppercase mb-4 sm:mb-6 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Security Settings</h3>
          
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
              <div className={`p-2.5 sm:p-3 shrink-0 rounded-xl ${isDarkMode ? 'bg-slate-800 text-green-400' : 'bg-green-50 text-green-600'}`}>
                <Shield className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0">
                <p className={`text-sm sm:text-base font-bold truncate ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Two-Factor Authentication (2FA)</p>
                <p className={`text-xs sm:text-sm mt-0.5 sm:mt-0 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Require a code sent to your email to make transfers.</p>
              </div>
            </div>
            <ToggleSwitch enabled={twoFactor} onChange={() => setTwoFactor(!twoFactor)} />
          </div>
        </div>

      </div>
    </div>
  );
}