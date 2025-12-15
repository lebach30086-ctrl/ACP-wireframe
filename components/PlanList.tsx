import React, { useState } from 'react';
import { Plus, Filter, Search, MoreHorizontal, ChevronRight, TrendingUp, DollarSign, BarChart3, PieChart } from 'lucide-react';
import { AccountPlan } from '../types';

interface PlanListProps {
    onSelectPlan: (plan: AccountPlan) => void;
    onCreatePlan: () => void;
}

const MOCK_PLANS: AccountPlan[] = [
    { id: '1', accountName: 'Acme Corp', fiscalYear: 'FY2024', owner: 'John Doe', status: 'Active', progress: 65, industry: 'Manufacturing', revenue: 1200000, winRate: 45 },
    { id: '2', accountName: 'Globex Inc', fiscalYear: 'FY2024', owner: 'Sarah Smith', status: 'Review', progress: 80, industry: 'Logistics', revenue: 850000, winRate: 60 },
    { id: '3', accountName: 'Soylent Corp', fiscalYear: 'FY2025', owner: 'Mike Brown', status: 'Draft', progress: 15, industry: 'Technology', revenue: 2000000, winRate: 30 },
    { id: '4', accountName: 'Initech', fiscalYear: 'FY2024', owner: 'John Doe', status: 'Completed', progress: 100, industry: 'Software', revenue: 500000, winRate: 75 },
    { id: '5', accountName: 'Umbrella Corp', fiscalYear: 'FY2025', owner: 'Alice Wong', status: 'Active', progress: 40, industry: 'Pharma', revenue: 3500000, winRate: 50 },
];

const PlanList: React.FC<PlanListProps> = ({ onSelectPlan, onCreatePlan }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredPlans = MOCK_PLANS.filter(plan => 
        plan.accountName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusColor = (status: string) => {
        switch(status) {
            case 'Active': return 'bg-green-100 text-green-700';
            case 'Draft': return 'bg-slate-100 text-slate-700';
            case 'Review': return 'bg-orange-100 text-orange-700';
            case 'Completed': return 'bg-blue-100 text-blue-700';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    // Metrics Calculation
    const totalRevenue = MOCK_PLANS.reduce((acc, curr) => acc + curr.revenue, 0);
    const avgWinRate = Math.round(MOCK_PLANS.reduce((acc, curr) => acc + curr.winRate, 0) / MOCK_PLANS.length);
    const avgProgress = Math.round(MOCK_PLANS.reduce((acc, curr) => acc + curr.progress, 0) / MOCK_PLANS.length);
    const activePlans = MOCK_PLANS.filter(p => p.status === 'Active').length;

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            notation: 'compact',
            maximumFractionDigits: 1
        }).format(value);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Account Plans</h2>
                    <p className="text-slate-500 text-sm">Manage your strategic account roadmaps and performance.</p>
                </div>
                <button 
                    onClick={onCreatePlan}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-sm shadow-blue-200"
                >
                    <Plus size={18} />
                    Create Account Plan
                </button>
            </div>

            {/* Performance Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-slate-500 text-xs font-semibold uppercase tracking-wide">Total Pipeline</p>
                        <h3 className="text-2xl font-bold text-slate-800 mt-1">{formatCurrency(totalRevenue)}</h3>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                        <DollarSign size={20} />
                    </div>
                </div>
                
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-slate-500 text-xs font-semibold uppercase tracking-wide">Avg Win Rate</p>
                        <h3 className="text-2xl font-bold text-slate-800 mt-1">{avgWinRate}%</h3>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
                        <TrendingUp size={20} />
                    </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-slate-500 text-xs font-semibold uppercase tracking-wide">Avg Progress</p>
                        <h3 className="text-2xl font-bold text-slate-800 mt-1">{avgProgress}%</h3>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
                        <BarChart3 size={20} />
                    </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-slate-500 text-xs font-semibold uppercase tracking-wide">Active Plans</p>
                        <h3 className="text-2xl font-bold text-slate-800 mt-1">{activePlans}</h3>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center">
                        <PieChart size={20} />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                {/* Toolbar */}
                <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between bg-slate-50/50">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search accounts..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button className="flex items-center gap-2 px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-600 hover:bg-slate-50 text-sm font-medium">
                            <Filter size={16} />
                            Filters
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-xs border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4">Account Name</th>
                                <th className="px-6 py-4">Fiscal Year</th>
                                <th className="px-6 py-4">Owner</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Progress</th>
                                <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredPlans.map(plan => (
                                <tr 
                                    key={plan.id} 
                                    className="hover:bg-slate-50 transition-colors cursor-pointer group"
                                    onClick={() => onSelectPlan(plan)}
                                >
                                    <td className="px-6 py-4 font-medium text-slate-800">{plan.accountName}</td>
                                    <td className="px-6 py-4 text-slate-500">{plan.fiscalYear}</td>
                                    <td className="px-6 py-4 text-slate-500 flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                                            {plan.owner.charAt(0)}
                                        </div>
                                        {plan.owner}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border border-transparent ${getStatusColor(plan.status)}`}>
                                            {plan.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 w-48">
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                                <div 
                                                    className={`h-full rounded-full ${plan.progress === 100 ? 'bg-green-500' : 'bg-blue-500'}`} 
                                                    style={{ width: `${plan.progress}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-xs font-medium text-slate-600">{plan.progress}%</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-slate-400 hover:text-blue-600 p-2 rounded-full hover:bg-blue-50 transition-all opacity-0 group-hover:opacity-100">
                                            <ChevronRight size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PlanList;