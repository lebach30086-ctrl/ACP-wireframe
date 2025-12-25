
import React from 'react';
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  Settings, 
  LogOut, 
  Bell, 
  Search,
  Menu,
  Building2,
  BarChart3
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab?: string;
  onNavigate?: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab = 'Account Planning', onNavigate }) => {
  const handleNavClick = (tab: string) => {
    if (onNavigate) {
      onNavigate(tab);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex-shrink-0 hidden md:flex flex-col">
        <div className="p-4 border-b border-slate-700 flex items-center gap-3">
            <div className="w-9 h-9 relative flex items-center justify-center shrink-0">
                <svg width="100%" height="100%" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id="blueGrad" x1="0" y1="0" x2="40" y2="40">
                            <stop offset="0%" stopColor="#60A5FA"/>
                            <stop offset="100%" stopColor="#2563EB"/>
                        </linearGradient>
                    </defs>
                    <path d="M20 0L37.32 10L20 20L2.68 10L20 0Z" fill="#3B82F6"/>
                    <path d="M37.32 10L37.32 30L20 20L37.32 10Z" fill="#2563EB"/>
                    <path d="M37.32 30L20 40L20 20L37.32 30Z" fill="#1D4ED8"/>
                    <path d="M20 40L2.68 30L20 20L20 40Z" fill="#1E40AF"/>
                    <path d="M2.68 30L2.68 10L20 20L2.68 30Z" fill="#3B82F6"/>
                    <path d="M2.68 10L20 0L20 20L2.68 10Z" fill="#60A5FA"/>
                    <path d="M20 7L31.2 13.5V26.5L20 33L8.8 26.5V13.5L20 7Z" fill="white"/>
                    <circle cx="20" cy="17" r="4.5" stroke="#2563EB" strokeWidth="2.5"/>
                    <path d="M11 30C11 25 15 21.5 20 21.5C25 21.5 29 25 29 30" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
            </div>
            <span className="text-white font-bold text-xl tracking-tight">Mobio</span>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 mt-2">Modules</div>
            <NavItem 
                icon={<LayoutDashboard size={20} />} 
                label="Dashboard" 
                active={activeTab === 'Dashboard'} 
                onClick={() => handleNavClick('Dashboard')}
            />
            <NavItem 
                icon={<Building2 size={20} />} 
                label="Company" 
                active={activeTab === 'Company'} 
                onClick={() => handleNavClick('Company')}
            />
            <NavItem 
                icon={<Briefcase size={20} />} 
                label="Account Planning" 
                active={activeTab === 'Account Planning'} 
                onClick={() => handleNavClick('Account Planning')}
            />
            <NavItem 
                icon={<BarChart3 size={20} />} 
                label="Reports" 
                active={activeTab === 'Reports'} 
                onClick={() => handleNavClick('Reports')}
            />
            
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 mt-6">System</div>
            <NavItem 
                icon={<Settings size={20} />} 
                label="Settings" 
                active={activeTab === 'Settings'} 
                onClick={() => handleNavClick('Settings')}
            />
        </nav>

        <div className="p-4 border-t border-slate-700">
            <button className="flex items-center gap-3 w-full hover:text-white transition-colors">
                <LogOut size={20} />
                <span>Logout</span>
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 flex-shrink-0 z-10">
            <div className="flex items-center gap-4">
                <button className="md:hidden text-slate-500"><Menu size={24} /></button>
                <h1 className="text-xl font-bold text-slate-800">{activeTab}</h1>
            </div>

            <div className="flex items-center gap-6">
                <div className="relative hidden sm:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                        type="text" 
                        placeholder="Global search..." 
                        className="pl-9 pr-4 py-1.5 rounded-full border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                    />
                </div>
                <button className="relative text-slate-500 hover:text-slate-700">
                    <Bell size={20} />
                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 text-white flex items-center justify-center font-bold text-xs shadow-md border border-white">
                    JD
                </div>
            </div>
        </header>

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-6">
            {children}
        </main>
      </div>
    </div>
  );
};

const NavItem: React.FC<{ icon: React.ReactNode; label: string; active?: boolean; onClick?: () => void }> = ({ icon, label, active, onClick }) => (
    <button 
        onClick={onClick}
        className={`flex items-center gap-3 w-full px-3 py-2 rounded-md transition-colors ${active ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 hover:text-white'}`}
    >
        {icon}
        <span className="text-sm font-medium">{label}</span>
    </button>
);

export default Layout;
