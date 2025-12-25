
import React, { useState, useRef, useEffect } from 'react';
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    Legend, 
    ResponsiveContainer, 
    PieChart, 
    Pie, 
    Cell,
    LineChart,
    Line,
    AreaChart,
    Area
} from 'recharts';
import { 
    Download, 
    Filter, 
    TrendingUp, 
    Users, 
    Target, 
    AlertCircle, 
    CheckCircle2, 
    Clock, 
    ChevronDown,
    FileSpreadsheet,
    FileText
} from 'lucide-react';

const ADOPTION_DATA = [
    { name: 'Approved', value: 45, color: '#22c55e' },
    { name: 'Review', value: 20, color: '#f59e0b' },
    { name: 'Draft', value: 35, color: '#94a3b8' },
];

const WIN_RATE_COMPARISON = [
    { name: 'Enterprise', withACP: 65, withoutACP: 42 },
    { name: 'Corporate', withACP: 58, withoutACP: 38 },
    { name: 'SME', withACP: 72, withoutACP: 48 },
    { name: 'Retail', withACP: 45, withoutACP: 35 },
];

const APPROVAL_TIME_DATA = [
    { name: 'John Doe', days: 2.5 },
    { name: 'Sarah Smith', days: 4.2 },
    { name: 'Mike Brown', days: 1.8 },
    { name: 'Alice Wong', days: 3.5 },
];

const HEALTH_HEATMAP = [
    { name: 'TMZ Investment', score: 85, status: 'Healthy' },
    { name: 'Globex Inc', score: 62, status: 'Warning' },
    { name: 'Soylent Corp', score: 40, status: 'At Risk' },
    { name: 'Initech', score: 92, status: 'Healthy' },
    { name: 'Umbrella Corp', score: 55, status: 'Warning' },
    { name: 'Cyberdyne', score: 38, status: 'At Risk' },
];

const WHITESPACE_CONVERSION = [
    { month: 'Jan', opportunities: 12, won: 4 },
    { month: 'Feb', opportunities: 18, won: 7 },
    { month: 'Mar', opportunities: 15, won: 6 },
    { month: 'Apr', opportunities: 22, won: 10 },
    { month: 'May', opportunities: 25, won: 12 },
];

const ReportDashboard: React.FC = () => {
    const [period, setPeriod] = useState('Q2 2024');
    const [team, setTeam] = useState('All Teams');
    const [isExportDropdownOpen, setIsExportDropdownOpen] = useState(false);
    const exportDropdownRef = useRef<HTMLDivElement>(null);

    const getStatusColor = (score: number) => {
        if (score >= 80) return 'text-green-600 bg-green-50 border-green-200';
        if (score >= 50) return 'text-amber-600 bg-amber-50 border-amber-200';
        return 'text-red-600 bg-red-50 border-red-200';
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (exportDropdownRef.current && !exportDropdownRef.current.contains(event.target as Node)) {
                setIsExportDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="space-y-6 animate-fade-in pb-12">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Leadership Strategic Dashboard</h2>
                    <p className="text-slate-500 text-sm">Toàn cảnh hiệu suất và sức khỏe hệ thống Account Planning.</p>
                </div>
                
                {/* Merged Export Button Dropdown */}
                <div className="relative" ref={exportDropdownRef}>
                    <button 
                        onClick={() => setIsExportDropdownOpen(!isExportDropdownOpen)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-bold shadow-md shadow-blue-100 transition-all active:scale-95"
                    >
                        <Download size={18} /> Export Report <ChevronDown size={14} className={`transition-transform duration-200 ${isExportDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {isExportDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden py-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
                            <button 
                                className="flex items-center gap-3 w-full px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 font-bold text-left transition-colors"
                                onClick={() => setIsExportDropdownOpen(false)}
                            >
                                <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                                    <FileSpreadsheet size={16} />
                                </div>
                                <div>
                                    <div className="text-slate-800">Export to Excel</div>
                                    <div className="text-[10px] text-slate-400 font-medium">Detailed raw data analysis</div>
                                </div>
                            </button>
                            <div className="h-px bg-slate-50 mx-2 my-1"></div>
                            <button 
                                className="flex items-center gap-3 w-full px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 font-bold text-left transition-colors"
                                onClick={() => setIsExportDropdownOpen(false)}
                            >
                                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                    <FileText size={16} />
                                </div>
                                <div>
                                    <div className="text-slate-800">Export to PDF</div>
                                    <div className="text-[10px] text-slate-400 font-medium">Executive summary report</div>
                                </div>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Filters Row */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2">
                    <Filter size={16} className="text-slate-400" />
                    <span className="text-sm font-bold text-slate-700 uppercase tracking-widest">FILTERS:</span>
                </div>
                <div className="relative">
                    <select 
                        value={period} 
                        onChange={(e) => setPeriod(e.target.value)}
                        className="appearance-none pl-4 pr-10 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-600 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                    >
                        <option>Q1 2024</option>
                        <option>Q2 2024</option>
                        <option>Q3 2024</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
                </div>
                <div className="relative">
                    <select 
                        value={team} 
                        onChange={(e) => setTeam(e.target.value)}
                        className="appearance-none pl-4 pr-10 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-600 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                    >
                        <option>All Teams</option>
                        <option>North Region</option>
                        <option>South Region</option>
                        <option>International</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
                </div>
            </div>

            {/* Adoption Metrics Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <SummaryCard title="ACP Adoption Rate" value="78.5%" trend="+5.2%" icon={<CheckCircle2 className="text-green-500" />} />
                <SummaryCard title="Avg Approval Time" value="2.8 Days" trend="-0.4d" icon={<Clock className="text-blue-500" />} />
                <SummaryCard title="Pipeline Coverage" value="62%" trend="+12%" icon={<Target className="text-purple-500" />} />
                <SummaryCard title="At-Risk Accounts" value="5" trend="+2" icon={<AlertCircle className="text-red-500" />} variant="danger" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Adoption Status Chart */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <TrendingUp size={20} className="text-blue-600" />
                        ACP Adoption Status
                    </h3>
                    <div className="h-[300px] flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={ADOPTION_DATA}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {ADOPTION_DATA.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36}/>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Win Rate Comparison */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <Target size={20} className="text-purple-600" />
                        Win Rate Comparison
                    </h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={WIN_RATE_COMPARISON} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                                <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} />
                                <Legend iconType="circle" />
                                <Bar dataKey="withACP" name="With ACP" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="withoutACP" name="Without ACP" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Account Health Heatmap (Table Style) */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm lg:col-span-1">
                    <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <AlertCircle size={20} className="text-red-500" />
                        Account Health Heatmap
                    </h3>
                    <div className="space-y-4">
                        {HEALTH_HEATMAP.map((account, i) => (
                            <div key={i} className="flex items-center justify-between p-3 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer group">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 text-xs font-bold">
                                        {account.name.charAt(0)}
                                    </div>
                                    <span className="text-sm font-bold text-slate-700">{account.name}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full rounded-full ${account.score >= 80 ? 'bg-green-500' : account.score >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                                            style={{ width: `${account.score}%` }}
                                        />
                                    </div>
                                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wide border ${getStatusColor(account.score)}`}>
                                        {account.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                        <button className="w-full py-2 text-sm text-blue-600 font-bold hover:underline">View All Accounts</button>
                    </div>
                </div>

                {/* Whitespace Conversion */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm lg:col-span-1">
                    <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <TrendingUp size={20} className="text-indigo-600" />
                        Whitespace Conversion Rate
                    </h3>
                    <div className="h-[280px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={WHITESPACE_CONVERSION}>
                                <defs>
                                    <linearGradient id="colorWon" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                                <Tooltip />
                                <Area type="monotone" dataKey="won" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorWon)" />
                                <Area type="monotone" dataKey="opportunities" stroke="#cbd5e1" strokeWidth={1} strokeDasharray="5 5" fill="none" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-4 p-4 bg-indigo-50 border border-indigo-100 rounded-lg">
                        <p className="text-xs text-indigo-700 leading-relaxed font-medium">
                            <span className="font-bold">Insight:</span> Tỷ lệ chuyển đổi Whitespace tăng <span className="text-indigo-900 font-black">15%</span> kể từ khi áp dụng công cụ gợi ý AI trong Q2.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const SummaryCard: React.FC<{ title: string; value: string; trend: string; icon: React.ReactNode; variant?: 'default' | 'danger' }> = ({ title, value, trend, icon, variant = 'default' }) => (
    <div className={`bg-white p-6 rounded-xl border shadow-sm transition-transform hover:scale-[1.02] ${variant === 'danger' && trend.startsWith('+') ? 'border-red-100' : 'border-slate-200'}`}>
        <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-slate-50 rounded-lg">
                {icon}
            </div>
            <span className={`text-xs font-black px-2 py-0.5 rounded-full ${trend.startsWith('+') ? (variant === 'danger' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600') : 'bg-slate-100 text-slate-600'}`}>
                {trend}
            </span>
        </div>
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</h3>
        <p className="text-2xl font-black text-slate-800">{value}</p>
    </div>
);

export default ReportDashboard;
