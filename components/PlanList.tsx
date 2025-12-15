import React, { useState } from 'react';
import { Plus, Filter, Search, ChevronRight, TrendingUp, DollarSign, BarChart3, PieChart, Building2, ChevronDown } from 'lucide-react';
import { AccountPlan } from '../types';

interface PlanListProps {
    onSelectPlan: (plan: AccountPlan) => void;
    onCreatePlan: () => void;
    onSelectCompanyId: (companyId: string) => void;
}

const MOCK_PLANS: AccountPlan[] = [
    { 
        id: '1', 
        accountName: 'Digital Transformation 2024', 
        companyId: '1',
        companyName: 'Công ty CP Đầu tư TMZ',
        companySegment: 'Enterprise',
        fiscalYear: 'FY2024', 
        owner: 'John Doe', 
        status: 'Active', 
        progress: 65, 
        industry: 'Hospitality', 
        revenue: 1200000, 
        winRate: 45 
    },
    { 
        id: '2', 
        accountName: 'Cloud Migration Strategy', 
        companyId: '2',
        companyName: 'Globex Inc',
        companySegment: 'Corporate',
        fiscalYear: 'FY2024', 
        owner: 'Sarah Smith', 
        status: 'Review', 
        progress: 80, 
        industry: 'Logistics', 
        revenue: 850000, 
        winRate: 60 
    },
    { 
        id: '3', 
        accountName: 'AI Integration Phase 1', 
        companyId: '3',
        companyName: 'Soylent Corp',
        companySegment: 'SME',
        fiscalYear: 'FY2025', 
        owner: 'Mike Brown', 
        status: 'Draft', 
        progress: 15, 
        industry: 'Technology', 
        revenue: 2000000, 
        winRate: 30 
    },
    { 
        id: '4', 
        accountName: 'Enterprise Licensing Renewal', 
        companyId: '4',
        companyName: 'Initech',
        companySegment: 'Enterprise',
        fiscalYear: 'FY2024', 
        owner: 'John Doe', 
        status: 'Completed', 
        progress: 100, 
        industry: 'Software', 
        revenue: 500000, 
        winRate: 75 
    },
    { 
        id: '5', 
        accountName: 'Security Infrastructure Upgrade', 
        companyId: '5',
        companyName: 'Umbrella Corp',
        companySegment: 'Corporate',
        fiscalYear: 'FY2025', 
        owner: 'Alice Wong', 
        status: 'Active', 
        progress: 40, 
        industry: 'Pharma', 
        revenue: 3500000, 
        winRate: 50 
    },
    { 
        id: '6', 
        accountName: 'Data Center Consolidation', 
        companyId: '6', 
        companyName: 'Cyberdyne Systems', 
        companySegment: 'Enterprise', 
        fiscalYear: 'FY2024', 
        owner: 'Sarah Smith', 
        status: 'Active', 
        progress: 55, 
        industry: 'Defense', 
        revenue: 4200000, 
        winRate: 40 
    },
    { 
        id: '7', 
        accountName: 'Q3 Marketing Campaign', 
        companyId: '7', 
        companyName: 'Massive Dynamic', 
        companySegment: 'Corporate', 
        fiscalYear: 'FY2024', 
        owner: 'Mike Brown', 
        status: 'Review', 
        progress: 90, 
        industry: 'Research', 
        revenue: 150000, 
        winRate: 70 
    },
    { 
        id: '8', 
        accountName: 'Retail POS Rollout', 
        companyId: '8', 
        companyName: 'Buy n Large', 
        companySegment: 'Retail', 
        fiscalYear: 'FY2025', 
        owner: 'John Doe', 
        status: 'Draft', 
        progress: 5, 
        industry: 'Retail', 
        revenue: 8000000, 
        winRate: 25 
    },
    { 
        id: '9', 
        accountName: 'Fleet Management System', 
        companyId: '9', 
        companyName: 'Weyland-Yutani', 
        companySegment: 'Enterprise', 
        fiscalYear: 'FY2024', 
        owner: 'Alice Wong', 
        status: 'Active', 
        progress: 30, 
        industry: 'Space', 
        revenue: 12000000, 
        winRate: 35 
    },
    { 
        id: '10', 
        accountName: 'HRIS Implementation', 
        companyId: '10', 
        companyName: 'Stark Industries', 
        companySegment: 'Enterprise', 
        fiscalYear: 'FY2024', 
        owner: 'Sarah Smith', 
        status: 'Completed', 
        progress: 100, 
        industry: 'Defense', 
        revenue: 950000, 
        winRate: 90 
    },
    { 
        id: '11', 
        accountName: 'Supply Chain Optimization', 
        companyId: '11', 
        companyName: 'Acme Corp', 
        companySegment: 'SME', 
        fiscalYear: 'FY2025', 
        owner: 'Mike Brown', 
        status: 'Draft', 
        progress: 10, 
        industry: 'Manufacturing', 
        revenue: 300000, 
        winRate: 50 
    },
    { 
        id: '12', 
        accountName: 'Network Security Audit', 
        companyId: '12', 
        companyName: 'Wayne Enterprises', 
        companySegment: 'Enterprise', 
        fiscalYear: 'FY2024', 
        owner: 'John Doe', 
        status: 'Review', 
        progress: 75, 
        industry: 'Conglomerate', 
        revenue: 600000, 
        winRate: 65 
    },
    { 
        id: '13', 
        accountName: 'Cloud Storage Expansion', 
        companyId: '13', 
        companyName: 'Hooli', 
        companySegment: 'Corporate', 
        fiscalYear: 'FY2024', 
        owner: 'Alice Wong', 
        status: 'Active', 
        progress: 45, 
        industry: 'Technology', 
        revenue: 2500000, 
        winRate: 55 
    },
    { 
        id: '14', 
        accountName: 'Mobile App Development', 
        companyId: '14', 
        companyName: 'Pied Piper', 
        companySegment: 'SME', 
        fiscalYear: 'FY2024', 
        owner: 'Sarah Smith', 
        status: 'Active', 
        progress: 60, 
        industry: 'Technology', 
        revenue: 180000, 
        winRate: 80 
    },
    { 
        id: '15', 
        accountName: 'Legacy System Modernization', 
        companyId: '15', 
        companyName: 'InGen', 
        companySegment: 'Corporate', 
        fiscalYear: 'FY2025', 
        owner: 'Mike Brown', 
        status: 'Draft', 
        progress: 0, 
        industry: 'Biotech', 
        revenue: 5500000, 
        winRate: 20 
    },
    { 
        id: '16', 
        accountName: 'Customer Experience Overhaul', 
        companyId: '16', 
        companyName: 'Oceanic Airlines', 
        companySegment: 'Enterprise', 
        fiscalYear: 'FY2024', 
        owner: 'John Doe', 
        status: 'Review', 
        progress: 85, 
        industry: 'Travel', 
        revenue: 1100000, 
        winRate: 50 
    },
    { 
        id: '17', 
        accountName: 'Blockchain Pilot', 
        companyId: '17', 
        companyName: 'E Corp', 
        companySegment: 'Enterprise', 
        fiscalYear: 'FY2025', 
        owner: 'Alice Wong', 
        status: 'Draft', 
        progress: 20, 
        industry: 'Finance', 
        revenue: 3000000, 
        winRate: 15 
    },
    { 
        id: '18', 
        accountName: 'Smart Office IoT', 
        companyId: '18', 
        companyName: 'Aperture Science', 
        companySegment: 'Corporate', 
        fiscalYear: 'FY2024', 
        owner: 'Sarah Smith', 
        status: 'Completed', 
        progress: 100, 
        industry: 'Research', 
        revenue: 750000, 
        winRate: 85 
    },
    { 
        id: '19', 
        accountName: 'Global Compliance Strategy', 
        companyId: '19', 
        companyName: 'Tyrell Corp', 
        companySegment: 'Enterprise', 
        fiscalYear: 'FY2024', 
        owner: 'Mike Brown', 
        status: 'Active', 
        progress: 40, 
        industry: 'Biotech', 
        revenue: 4500000, 
        winRate: 45 
    },
    { 
        id: '20', 
        accountName: 'Remote Work Infrastructure', 
        companyId: '20', 
        companyName: 'Vandelay Industries', 
        companySegment: 'SME', 
        fiscalYear: 'FY2024', 
        owner: 'John Doe', 
        status: 'Active', 
        progress: 70, 
        industry: 'Import/Export', 
        revenue: 200000, 
        winRate: 60 
    },
];

const PlanList: React.FC<PlanListProps> = ({ onSelectPlan, onCreatePlan, onSelectCompanyId }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [segmentFilter, setSegmentFilter] = useState('All');

    const filteredPlans = MOCK_PLANS.filter(plan => {
        const matchesSearch = plan.accountName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            plan.companyName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || plan.status === statusFilter;
        const matchesSegment = segmentFilter === 'All' || plan.companySegment === segmentFilter;

        return matchesSearch && matchesStatus && matchesSegment;
    });

    const getStatusColor = (status: string) => {
        switch(status) {
            case 'Active': return 'bg-green-100 text-green-700';
            case 'Draft': return 'bg-slate-100 text-slate-700';
            case 'Review': return 'bg-orange-100 text-orange-700';
            case 'Completed': return 'bg-blue-100 text-blue-700';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    const getSegmentColor = (segment?: string) => {
        switch(segment) {
            case 'Enterprise': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'Corporate': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'SME': return 'bg-green-100 text-green-700 border-green-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
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
                <div className="p-4 border-b border-slate-200 flex flex-col xl:flex-row gap-4 justify-between bg-slate-50/50">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search by plan name or company..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                         {/* Status Filter */}
                        <div className="relative">
                            <select 
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="appearance-none pl-4 pr-10 py-2 rounded-lg border border-slate-300 bg-white text-slate-600 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                            >
                                <option value="All">All Status</option>
                                <option value="Draft">Draft</option>
                                <option value="Active">Active</option>
                                <option value="Review">Review</option>
                                <option value="Completed">Completed</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                        </div>

                         {/* Segment Filter */}
                         <div className="relative">
                            <select 
                                value={segmentFilter}
                                onChange={(e) => setSegmentFilter(e.target.value)}
                                className="appearance-none pl-4 pr-10 py-2 rounded-lg border border-slate-300 bg-white text-slate-600 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                            >
                                <option value="All">All Segments</option>
                                <option value="Enterprise">Enterprise</option>
                                <option value="Corporate">Corporate</option>
                                <option value="SME">SME</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                        </div>
                        
                        <button className="flex items-center gap-2 px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-600 hover:bg-slate-50 text-sm font-medium">
                            <Filter size={16} />
                            More Filters
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-xs border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4">Plan Name</th>
                                <th className="px-6 py-4">Company</th>
                                <th className="px-6 py-4">Segment</th>
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
                                    <td className="px-6 py-4 font-bold text-slate-800">{plan.accountName}</td>
                                    <td className="px-6 py-4">
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onSelectCompanyId(plan.companyId);
                                            }}
                                            className="flex items-center gap-2 text-blue-600 hover:underline hover:text-blue-700"
                                        >
                                            <Building2 size={14} />
                                            <span className="font-medium truncate max-w-[150px]">{plan.companyName}</span>
                                        </button>
                                    </td>
                                    <td className="px-6 py-4">
                                        {plan.companySegment && (
                                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getSegmentColor(plan.companySegment)}`}>
                                                {plan.companySegment}
                                            </span>
                                        )}
                                    </td>
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
                                    <td className="px-6 py-4 w-40">
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