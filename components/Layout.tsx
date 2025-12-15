import React from 'react';
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  Settings, 
  LogOut, 
  Bell, 
  Search,
  Menu
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex-shrink-0 hidden md:flex flex-col">
        <div className="p-4 border-b border-slate-700 flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">S</div>
            <span className="text-white font-semibold text-lg">SmartCRM</span>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 mt-2">Modules</div>
            <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" />
            <NavItem icon={<Briefcase size={20} />} label="Account Planning" active />
            <NavItem icon={<Users size={20} />} label="Customers" />
            
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 mt-6">System</div>
            <NavItem icon={<Settings size={20} />} label="Settings" />
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
                <h1 className="text-xl font-bold text-slate-800">Account Planning</h1>
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

const NavItem: React.FC<{ icon: React.ReactNode; label: string; active?: boolean }> = ({ icon, label, active }) => (
    <button className={`flex items-center gap-3 w-full px-3 py-2 rounded-md transition-colors ${active ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 hover:text-white'}`}>
        {icon}
        <span className="text-sm font-medium">{label}</span>
    </button>
);

export default Layout;