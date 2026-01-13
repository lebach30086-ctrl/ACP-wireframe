import React, { useState } from 'react';
import { 
    ResponsiveContainer, 
    PieChart, 
    Pie, 
    Cell,
    Tooltip
} from 'recharts';
import { 
    Target, 
    Award, 
    Plus, 
    Edit2, 
    BarChart2, 
    Building, 
    DollarSign, 
    Wallet, 
    Save, 
    X, 
    CheckSquare, 
    Check,
    CheckCircle2,
    AlertTriangle,
    ChevronDown,
    ChevronUp,
    ArrowRight,
    Package,
    Eye,
    EyeOff,
    Clock,
    CircleDashed,
    XCircle,
    Activity,
    Briefcase,
    TrendingUp,
    ChevronRight,
    ArrowUpRight
} from 'lucide-react';
import { AccountPlan, PlanTab } from '../../types';
import Modal from '../ui/Modal';

interface OverviewTabProps {
    plan: AccountPlan;
    onUpdatePlan: (fields: Partial<AccountPlan>) => void;
    onTabChange?: (tab: PlanTab) => void;
    visibleSections?: Record<string, boolean>;
    onGoToCompany?: (companyId: string) => void;
}

const REVENUE_DATA = [
    { month: 'Q1', actual: 120, target: 150 },
    { month: 'Q2', actual: 180, target: 160 },
    { month: 'Q3', actual: 240, target: 200 },
    { month: 'Q4', actual: 0, target: 300 }, // Projected
];

interface FinancialRecord {
    year: string;
    reportType: string;
    revenue: string;
    assets: string;
    equity: string;
    netProfit: string;
    creditDebt: string;
    workingCapitalTurnover: string;
    roa: string;
    roe: string;
}

interface Opportunity {
    id: string;
    name: string;
    productLine: string;
    product: string;
    stage: string;
    status: 'Open' | 'Won' | 'Lost';
    value: string;
}

const INITIAL_FINANCIAL_RECORDS: FinancialRecord[] = [
    {
        year: '2022',
        reportType: 'Báo cáo thuế',
        revenue: '209.498.482.028',
        assets: '190.097.472.065',
        equity: '80.038.649.658',
        netProfit: '--',
        creditDebt: '--',
        workingCapitalTurnover: '--',
        roa: '0,8',
        roe: '--'
    },
    {
        year: '2023',
        reportType: 'Báo cáo tài chính',
        revenue: '245.120.550.000',
        assets: '210.350.120.000',
        equity: '95.200.000.000',
        netProfit: '12.400.000.000',
        creditDebt: '15.000.000.000',
        workingCapitalTurnover: '1.2',
        roa: '5,9',
        roe: '13,0'
    },
    {
        year: '2024',
        reportType: 'Báo cáo dự kiến',
        revenue: '280.000.000.000',
        assets: '240.000.000.000',
        equity: '110.000.000.000',
        netProfit: '18.500.000.000',
        creditDebt: '12.000.000.000',
        workingCapitalTurnover: '1.4',
        roa: '7,7',
        roe: '16,8'
    }
];

const MOCK_OPPORTUNITIES: Opportunity[] = [
    {
        id: 'opp1',
        name: 'Gói thấu chi Q3 - Digital Expansion',
        productLine: 'CREDIT',
        product: 'Vay thấu chi doanh nghiệp',
        stage: 'NEGOTIATION',
        status: 'Open',
        value: '$450,000'
    },
    {
        id: 'opp2',
        name: 'Dịch vụ trả lương Mobio Enterprise',
        productLine: 'DEPOSIT',
        product: 'Payroll Smart 2.0',
        stage: 'PROPOSAL',
        status: 'Open',
        value: '$120,000'
    },
    {
        id: 'opp3',
        name: 'Hợp đồng ngoại hối Forward 6M',
        productLine: 'GLOBAL MARKETS',
        product: 'FX Spot & Forward',
        stage: 'QUALIFICATION',
        status: 'Open',
        value: '$850,000'
    }
];

const OverviewTab: React.FC<OverviewTabProps> = ({ plan, onUpdatePlan, onTabChange, visibleSections, onGoToCompany }) => {
    const isNew = plan.isNew;
    const [isProfileExpanded, setIsProfileExpanded] = useState(true);
    
    // Financial Data State
    const [financialRecords, setFinancialRecords] = useState<FinancialRecord[]>(INITIAL_FINANCIAL_RECORDS);
    const [activeYear, setActiveYear] = useState<string>('2022');
    const [isEditingFinance, setIsEditingFinance] = useState(false);
    const [isAddYearOpen, setIsAddYearOpen] = useState(false);
    const [newYearInput, setNewYearInput] = useState('');

    // Product Holding Expanded State
    const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
        'active': true,
        'expired': false,
        'unused': false
    });

    const isVisible = (sectionId: string) => {
        if (!visibleSections) return true; // Default to true if not provided
        return visibleSections[sectionId] !== false;
    };

    const toggleGroup = (group: string) => {
        setExpandedGroups(prev => ({...prev, [group]: !prev[group]}));
    };

    const handleAddYear = () => {
        if (newYearInput && !financialRecords.find(r => r.year === newYearInput)) {
            const newRecord: FinancialRecord = {
                year: newYearInput,
                reportType: '',
                revenue: '',
                assets: '',
                equity: '',
                netProfit: '',
                creditDebt: '',
                workingCapitalTurnover: '',
                roa: '',
                roe: ''
            };
            const updatedRecords = [...financialRecords, newRecord].sort((a,b) => a.year.localeCompare(b.year));
            setFinancialRecords(updatedRecords);
            setActiveYear(newYearInput);
            setIsAddYearOpen(false);
            setNewYearInput('');
            setIsEditingFinance(true); 
        }
    };

    const updateFinancialRecord = (field: keyof FinancialRecord, value: string) => {
        setFinancialRecords(prev => prev.map(r => 
            r.year === activeYear ? { ...r, [field]: value } : r
        ));
    };

    const currentRecord = financialRecords.find(r => r.year === activeYear) || financialRecords[0];

    const FinancialField = ({ label, field, value }: { label: string, field: keyof FinancialRecord, value: string }) => {
        if (isEditingFinance) {
            return (
                <div className="flex items-center py-1.5">
                    <label className="w-1/3 text-[13px] font-medium text-slate-600">{label}</label>
                    <div className="flex-1">
                        <input 
                            type="text" 
                            value={value}
                            onChange={(e) => updateFinancialRecord(field, e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white text-slate-900 text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                        />
                    </div>
                </div>
            );
        }

        return (
            <div className="flex justify-between items-center py-3 border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors px-1 -mx-1 rounded">
                <span className="text-[13px] text-slate-500 font-medium">{label}</span>
                <span className="font-bold text-slate-800 text-[13px] text-right">{value || '--'}</span>
            </div>
        );
    };

    const taskStats = {
        completed: 12,
        inProgress: 5,
        overdue: 2,
        toDo: 8
    };
    const totalTasks = taskStats.completed + taskStats.inProgress + taskStats.toDo + taskStats.overdue;
    const overallProgress = Math.round((taskStats.completed / totalTasks) * 100);

    const getStageColor = (stage: string) => {
        switch(stage) {
            case 'QUALIFICATION': return 'bg-slate-100 text-slate-600 border-slate-200';
            case 'PROPOSAL': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'NEGOTIATION': return 'bg-purple-50 text-purple-600 border-purple-100';
            default: return 'bg-slate-50 text-slate-500 border-slate-100';
        }
    };

    // Calculate Donut Data for Revenue
    const totalTarget = REVENUE_DATA.reduce((acc, curr) => acc + curr.target, 0);
    const totalActual = REVENUE_DATA.reduce((acc, curr) => acc + curr.actual, 0);
    const revenueGap = Math.max(0, totalTarget - totalActual);
    const revenueProgressPercent = Math.round((totalActual / totalTarget) * 100);

    const donutData = [
        { name: 'Actual', value: totalActual, color: '#3b82f6' },
        { name: 'Gap', value: revenueGap, color: '#f1f5f9' },
    ];

    return (
        <div className="grid grid-cols-12 gap-6 animate-fade-in">
            {/* Left Column */}
            <div className="col-span-12 lg:col-span-4 space-y-6">
                {/* Account Profile */}
                {isVisible('profile') && (
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative group overflow-hidden">
                        <button 
                            onClick={() => setIsProfileExpanded(!isProfileExpanded)}
                            className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                            title={isProfileExpanded ? "Thu gọn thông tin" : "Hiển thị thông tin"}
                        >
                            {isProfileExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </button>
                        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <Building size={20} className="text-blue-600"/> 
                            Account Profile
                        </h3>
                        
                        {isProfileExpanded && (
                            <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
                                <div className="flex justify-between items-center pb-2 border-b border-slate-50">
                                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">Account</span>
                                    <button 
                                        onClick={() => onGoToCompany?.(plan.companyId)}
                                        className="font-bold text-blue-600 text-[13px] hover:underline flex items-center gap-1 group/link text-right"
                                        title="View Company Details"
                                    >
                                        {plan.companyName}
                                        <ArrowUpRight size={14} className="opacity-0 group-hover/link:opacity-100 transition-opacity" />
                                    </button>
                                </div>
                                <div className="flex justify-between items-center pb-2 border-b border-slate-50">
                                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">Industry</span>
                                    <span className="font-bold text-slate-800 text-[13px]">{plan.industry || 'Hospitality'}</span>
                                </div>
                                <div className="flex justify-between items-center pb-2 border-b border-slate-50">
                                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">Tax Code</span>
                                    <span className="font-bold text-slate-800 text-[13px] font-mono">{plan.taxCode || '0300300300'}</span>
                                </div>
                                <div className="flex justify-between items-center pb-2 border-b border-slate-50">
                                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">Legal Representative</span>
                                    <button className="font-bold text-blue-600 text-[13px] hover:underline transition-colors">
                                        {plan.legalRepresentative || 'Mrs. Hoa'}
                                    </button>
                                </div>
                                <div className="flex justify-between items-center pb-2 border-b border-slate-50">
                                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">Employees</span>
                                    <span className="font-bold text-slate-800 text-[13px]">{plan.employees || '5,000+'}</span>
                                </div>
                                <div className="flex justify-between items-center pb-2 border-b border-slate-50">
                                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">HQ Location</span>
                                    <span className="font-bold text-slate-800 text-[13px]">{plan.location || 'San Francisco, CA'}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">Tier</span>
                                    <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest bg-slate-100 text-slate-600 border border-slate-200">
                                        {plan.tier || 'Strategic'}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Product Holding */}
                {isVisible('product_holding') && (
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative">
                        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <Package size={20} className="text-blue-600" />
                            Product Holding
                        </h3>

                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="relative w-20 h-20 flex-shrink-0">
                                    <svg viewBox="0 0 100 100" className="transform -rotate-90 w-full h-full">
                                        <circle cx="50" cy="50" r="40" stroke="#f1f5f9" strokeWidth="6" fill="none" />
                                        <circle 
                                            cx="50" 
                                            cy="50" 
                                            r="40" 
                                            stroke="#22c55e" 
                                            strokeWidth="6" 
                                            fill="none" 
                                            strokeDasharray={`${(2/6)*251.2} 251.2`}
                                            strokeDashoffset="0"
                                            strokeLinecap="round" 
                                        />
                                        <circle 
                                            cx="50" 
                                            cy="50" 
                                            r="40" 
                                            stroke="#ef4444" 
                                            strokeWidth="6" 
                                            fill="none" 
                                            strokeDasharray={`${(1/6)*251.2} 251.2`}
                                            strokeDashoffset={`-${(2/6)*251.2}`}
                                            strokeLinecap="round" 
                                        />
                                        <circle 
                                            cx="50" 
                                            cy="50" 
                                            r="40" 
                                            stroke="#cbd5e1" 
                                            strokeWidth="6" 
                                            fill="none" 
                                            strokeDasharray={`${(3/6)*251.2} 251.2`}
                                            strokeDashoffset={`-${(3/6)*251.2}`}
                                            strokeLinecap="round" 
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center font-bold text-xl text-slate-800">
                                        3/6
                                    </div>
                                </div>
                                <div className="font-bold text-slate-800 text-[15px] leading-tight">
                                    Dòng sản phẩm đang sử dụng
                                </div>
                            </div>

                            <div className="space-y-4">
                                {/* Đang sử dụng */}
                                <div>
                                    <button onClick={() => toggleGroup('active')} className="w-full flex items-center justify-between mb-3 group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center shadow-sm">
                                                <Check size={12} strokeWidth={3} />
                                            </div>
                                            <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">ĐANG SỬ DỤNG</span>
                                            <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-black flex items-center justify-center">2</span>
                                        </div>
                                        <ChevronDown size={16} className={`text-slate-400 transition-transform duration-200 ${expandedGroups['active'] ? 'rotate-180' : ''}`} />
                                    </button>
                                    {expandedGroups['active'] && (
                                        <div className="pl-8 space-y-3 animate-in slide-in-from-top-2 duration-200">
                                            <div className="flex items-center justify-between group/item cursor-pointer p-2 hover:bg-slate-50 rounded-lg -ml-2 transition-colors">
                                                <div>
                                                    <div className="text-xs font-bold text-slate-800">Eximbank EDigi</div>
                                                    <div className="text-[9px] font-black text-slate-400 uppercase mt-0.5 tracking-widest">EBANK</div>
                                                </div>
                                                <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 opacity-0 group-hover/item:opacity-100 group-hover/item:bg-white group-hover/item:shadow-sm group-hover/item:text-blue-600 transition-all">
                                                    <ArrowRight size={14} />
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between group/item cursor-pointer p-2 hover:bg-slate-50 rounded-lg -ml-2 transition-colors">
                                                <div>
                                                    <div className="text-xs font-bold text-slate-800">Bảo hiểm</div>
                                                    <div className="text-[9px] font-black text-slate-400 uppercase mt-0.5 tracking-widest">BAO HIEM</div>
                                                </div>
                                                <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 opacity-0 group-hover/item:opacity-100 group-hover/item:bg-white group-hover/item:shadow-sm group-hover/item:text-blue-600 transition-all">
                                                    <ArrowRight size={14} />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Hết hạn sử dụng */}
                                <div>
                                    <button onClick={() => toggleGroup('expired')} className="w-full flex items-center justify-between mb-3 group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center shadow-sm">
                                                <X size={12} strokeWidth={3} />
                                            </div>
                                            <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">HẾT HẠN SỬ DỤNG</span>
                                            <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-black flex items-center justify-center">1</span>
                                        </div>
                                        <ChevronDown size={16} className={`text-slate-400 transition-transform duration-200 ${expandedGroups['expired'] ? 'rotate-180' : ''}`} />
                                    </button>
                                    {expandedGroups['expired'] && (
                                        <div className="pl-8 space-y-3 animate-in slide-in-from-top-2 duration-200">
                                            <div className="flex items-center justify-between group/item cursor-pointer p-2 hover:bg-slate-50 rounded-lg -ml-2 transition-colors">
                                                <div>
                                                    <div className="text-xs font-bold text-slate-800">Gói doanh nghiệp Q1</div>
                                                    <div className="text-[9px] font-black text-red-400 uppercase mt-0.5 tracking-widest">EXPIRED • 12/2023</div>
                                                </div>
                                                <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 opacity-0 group-hover/item:opacity-100 group-hover/item:bg-white group-hover/item:shadow-sm group-hover/item:text-blue-600 transition-all">
                                                    <ArrowRight size={14} />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Chưa sử dụng */}
                                <div>
                                    <button onClick={() => toggleGroup('unused')} className="w-full flex items-center justify-between mb-3 group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-5 h-5 rounded-full bg-slate-300 text-white flex items-center justify-center shadow-sm">
                                                <CircleDashed size={12} strokeWidth={3} />
                                            </div>
                                            <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">CHƯA SỬ DỤNG</span>
                                            <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-black flex items-center justify-center">3</span>
                                        </div>
                                        <ChevronDown size={16} className={`text-slate-400 transition-transform duration-200 ${expandedGroups['unused'] ? 'rotate-180' : ''}`} />
                                    </button>
                                    {expandedGroups['unused'] && (
                                        <div className="pl-8 space-y-3 animate-in slide-in-from-top-2 duration-200">
                                            <div className="flex items-center justify-between group/item cursor-pointer p-2 hover:bg-slate-50 rounded-lg -ml-2 transition-colors">
                                                <div>
                                                    <div className="text-xs font-bold text-slate-800">Gói tín dụng ưu đãi</div>
                                                    <div className="text-[9px] font-black text-slate-400 uppercase mt-0.5 tracking-widest">CREDIT</div>
                                                </div>
                                                <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 opacity-0 group-hover/item:opacity-100 group-hover/item:bg-white group-hover/item:shadow-sm group-hover/item:text-blue-600 transition-all">
                                                    <ArrowRight size={14} />
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between group/item cursor-pointer p-2 hover:bg-slate-50 rounded-lg -ml-2 transition-colors">
                                                <div>
                                                    <div className="text-xs font-bold text-slate-800">Tiền gửi có kỳ hạn</div>
                                                    <div className="text-[9px] font-black text-slate-400 uppercase mt-0.5 tracking-widest">DEPOSIT</div>
                                                </div>
                                                <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 opacity-0 group-hover/item:opacity-100 group-hover/item:bg-white group-hover/item:shadow-sm group-hover/item:text-blue-600 transition-all">
                                                    <ArrowRight size={14} />
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between group/item cursor-pointer p-2 hover:bg-slate-50 rounded-lg -ml-2 transition-colors">
                                                <div>
                                                    <div className="text-xs font-bold text-slate-800">Dịch vụ ngoại hối</div>
                                                    <div className="text-[9px] font-black text-slate-400 uppercase mt-0.5 tracking-widest">FX</div>
                                                </div>
                                                <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 opacity-0 group-hover/item:opacity-100 group-hover/item:bg-white group-hover/item:shadow-sm group-hover/item:text-blue-600 transition-all">
                                                    <ArrowRight size={14} />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Financial Situation */}
                {isVisible('financial') && (
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 group">
                        <div className="flex items-center justify-between mb-4">
                             <div className="flex items-center gap-2">
                                <Wallet size={20} className="text-blue-600" />
                                <h3 className="font-bold text-lg text-slate-800">
                                    Tình hình tài chính
                                </h3>
                             </div>
                             {!isEditingFinance && (
                                <button 
                                    onClick={() => setIsEditingFinance(true)}
                                    className="flex items-center gap-1 text-[11px] font-black uppercase text-blue-600 hover:text-blue-700 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Edit2 size={14} /> Edit
                                </button>
                            )}
                        </div>
                        
                        <div className="pt-0">
                            <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
                                {financialRecords.map(record => (
                                    <button
                                        key={record.year}
                                        onClick={() => { setActiveYear(record.year); setIsEditingFinance(false); }}
                                        className={`px-3 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-widest transition-colors whitespace-nowrap
                                            ${activeYear === record.year 
                                                ? 'bg-blue-50 text-blue-600 border border-blue-100 shadow-sm' 
                                                : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
                                            }`}
                                    >
                                        {record.year}
                                    </button>
                                ))}
                                <button 
                                    onClick={() => setIsAddYearOpen(true)}
                                    className="p-1.5 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                >
                                    <Plus size={16} />
                                </button>
                            </div>
                            
                            <div className="space-y-0.5">
                                {currentRecord ? (
                                    <>
                                        <FinancialField label="Loại báo cáo" field="reportType" value={currentRecord.reportType} />
                                        <FinancialField label="Tổng doanh thu (VNĐ)" field="revenue" value={currentRecord.revenue} />
                                        <FinancialField label="Tổng tài sản (VNĐ)" field="assets" value={currentRecord.assets} />
                                        <FinancialField label="Vốn chủ sở hữu (VNĐ)" field="equity" value={currentRecord.equity} />
                                        <FinancialField label="Lợi nhuận sau thuế (VNĐ)" field="netProfit" value={currentRecord.netProfit} />
                                        <FinancialField label="Tổng nợ vay tại các TCTD (VNĐ)" field="creditDebt" value={currentRecord.creditDebt} />
                                        <FinancialField label="Vòng quay VLĐ" field="workingCapitalTurnover" value={currentRecord.workingCapitalTurnover} />
                                        <FinancialField label="ROA (%)" field="roa" value={currentRecord.roa} />
                                        <FinancialField label="ROE (%)" field="roe" value={currentRecord.roe} />
                                    </>
                                ) : (
                                    <div className="p-8 text-center text-slate-300 text-xs font-bold italic">
                                        Không có dữ liệu
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Right Column */}
            <div className="col-span-12 lg:col-span-8 space-y-6">
                {/* Action Plan Progress */}
                {isVisible('action_progress') && (
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative group overflow-hidden">
                        <div className="flex justify-between items-center mb-6">
                             <h3 className="text-lg font-bold text-slate-800">
                                 Action Plan Progress
                             </h3>
                             <button 
                                onClick={() => onTabChange?.(PlanTab.ACTION_PLAN)}
                                className="text-[11px] font-black text-blue-600 uppercase hover:underline"
                            >
                                VIEW DETAILS
                            </button>
                        </div>

                        {/* Overall Plan Progress Box */}
                        {!isNew && (
                            <div className="mb-10 p-6 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <span className="text-[13px] font-black text-slate-700 uppercase tracking-widest">OVERALL PLAN PROGRESS</span>
                                    </div>
                                    <span className="text-3xl font-black text-blue-600 leading-none">{overallProgress}%</span>
                                </div>
                                <div className="h-3 w-full bg-white border border-slate-200 rounded-full overflow-hidden shadow-inner mb-3">
                                    <div 
                                        className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-1000 ease-out rounded-full" 
                                        style={{ width: `${overallProgress}%` }}
                                    ></div>
                                </div>
                                <div className="flex items-center justify-between text-[11px] font-medium text-slate-400 uppercase tracking-tighter">
                                    <span>{taskStats.completed}/{totalTasks} Goal Complete</span>
                                </div>
                            </div>
                        )}
                        
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                            <div className="md:col-span-7 flex flex-col sm:flex-row items-center gap-8">
                                <div className="relative w-32 h-32 flex-shrink-0">
                                    <svg viewBox="0 0 100 100" className="transform -rotate-90 w-full h-full">
                                        <circle cx="50" cy="50" r="40" stroke="#f8fafc" strokeWidth="10" fill="none" />
                                        <circle 
                                            cx="50" cy="50" r="40" stroke="#22c55e" strokeWidth="10" fill="none" 
                                            strokeDasharray={`${(taskStats.completed/totalTasks)*251.2} 251.2`}
                                            strokeDashoffset="0"
                                            strokeLinecap="round" 
                                        />
                                        <circle 
                                            cx="50" cy="50" r="40" stroke="#3b82f6" strokeWidth="10" fill="none" 
                                            strokeDasharray={`${(taskStats.inProgress/totalTasks)*251.2} 251.2`}
                                            strokeDashoffset={`-${(taskStats.completed/totalTasks)*251.2}`}
                                            strokeLinecap="round" 
                                        />
                                        <circle 
                                            cx="50" cy="50" r="40" stroke="#ef4444" strokeWidth="10" fill="none" 
                                            strokeDasharray={`${(taskStats.overdue/totalTasks)*251.2} 251.2`}
                                            strokeDashoffset={`-${((taskStats.completed + taskStats.inProgress)/totalTasks)*251.2}`}
                                            strokeLinecap="round" 
                                        />
                                        <circle 
                                            cx="50" cy="50" r="40" stroke="#e2e8f0" strokeWidth="10" fill="none" 
                                            strokeDasharray={`${(taskStats.toDo/totalTasks)*251.2} 251.2`}
                                            strokeDashoffset={`-${((taskStats.completed + taskStats.inProgress + taskStats.overdue)/totalTasks)*251.2}`}
                                            strokeLinecap="round" 
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-2xl font-black text-slate-800 leading-none">{totalTasks}</span>
                                        <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-1">Tasks</span>
                                    </div>
                                </div>

                                <div className="flex-1 w-full grid grid-cols-2 gap-4">
                                    <div className="p-3 bg-slate-50/50 rounded-xl border border-slate-100">
                                        <div className="flex items-center gap-1.5 mb-1">
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                            <div className="text-[9px] font-black text-slate-400 uppercase tracking-tight">Done</div>
                                        </div>
                                        <div className="text-sm font-black text-slate-800 ml-3">{taskStats.completed}</div>
                                    </div>
                                    <div className="p-3 bg-slate-50/50 rounded-xl border border-slate-100">
                                        <div className="flex items-center gap-1.5 mb-1">
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                            <div className="text-[9px] font-black text-slate-400 uppercase tracking-tight">Active</div>
                                        </div>
                                        <div className="text-sm font-black text-slate-800 ml-3">{taskStats.inProgress}</div>
                                    </div>
                                    <div className="p-3 bg-slate-50/50 rounded-xl border border-slate-100">
                                        <div className="flex items-center gap-1.5 mb-1">
                                            <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                                            <div className="text-[9px] font-black text-slate-400 uppercase tracking-tight">Late</div>
                                        </div>
                                        <div className="text-sm font-black text-slate-800 ml-3">{taskStats.overdue}</div>
                                    </div>
                                    <div className="p-3 bg-slate-50/50 rounded-xl border border-slate-100">
                                        <div className="flex items-center gap-1.5 mb-1">
                                            <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                                            <div className="text-[9px] font-black text-slate-400 uppercase tracking-tight">Wait</div>
                                        </div>
                                        <div className="text-sm font-black text-slate-800 ml-3">{taskStats.toDo}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="md:col-span-5 space-y-3 border-l border-slate-100 pl-8">
                                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Upcoming</h4>
                                <div className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 cursor-pointer">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[12px] font-bold text-slate-800 truncate">Finalize Q3 Contract</p>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5 tracking-tight">Tomorrow • JD</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 cursor-pointer">
                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5 shrink-0"></div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[12px] font-bold text-slate-800 truncate">Executive Briefing Prep</p>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5 tracking-tight">Oct 25 • SM</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Revenue Performance - Donut Chart Replacement */}
                {isVisible('revenue') && (
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm min-h-[360px] relative group">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                    <DollarSign size={20} className="text-green-600" />
                                    Revenue Performance
                                </h3>
                                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mt-1">Actual vs Target Summary (k USD)</p>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">TOTAL GOAL</span>
                                <span className="text-xl font-black text-slate-800">${totalTarget}k</span>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mt-4">
                            <div className="relative h-60 w-full flex items-center justify-center">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={donutData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={65}
                                            outerRadius={90}
                                            paddingAngle={4}
                                            dataKey="value"
                                            stroke="none"
                                            startAngle={90}
                                            endAngle={-270}
                                        >
                                            {donutData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip 
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 / 0.1)', fontSize: '11px', fontWeight: 'bold' }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                                {/* Center Value */}
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                    <span className="text-3xl font-black text-blue-600 leading-none">{revenueProgressPercent}%</span>
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">ACHIEVED</span>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 flex items-center gap-4 group/item hover:bg-blue-50/30 transition-colors">
                                    <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-100 shrink-0">
                                        <CheckCircle2 size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ACTUAL REVENUE</div>
                                        <div className="text-xl font-black text-slate-800">${totalActual}k</div>
                                    </div>
                                </div>

                                <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 flex items-center gap-4 group/item hover:bg-orange-50/30 transition-colors">
                                    <div className="w-10 h-10 rounded-xl bg-slate-200 flex items-center justify-center text-slate-500 shrink-0">
                                        <AlertTriangle size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">REVENUE GAP</div>
                                        <div className="text-xl font-black text-slate-800">${revenueGap}k</div>
                                    </div>
                                </div>

                                <div className="pt-2 px-2">
                                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                                        <TrendingUp size={14} className="text-blue-500" />
                                        <span>You are <b>${revenueGap}k</b> away from the yearly target.</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Opportunities Section - Converted to Card List as requested */}
                {isVisible('opportunities') && (
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative group overflow-hidden">
                        <div className="flex justify-between items-center mb-6">
                             <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                 <Briefcase size={20} className="text-indigo-600" />
                                 Cơ hội bán (Opportunities)
                             </h3>
                             <button className="flex items-center gap-1.5 text-[11px] font-black text-blue-600 uppercase hover:text-blue-700 transition-colors">
                                 <Plus size={16} /> NEW OPPORTUNITY
                             </button>
                        </div>

                        <div className="space-y-4">
                            {isNew ? (
                                <div className="py-12 flex flex-col items-center justify-center text-slate-400 border-t border-slate-50">
                                    <Briefcase size={32} className="opacity-10 mb-3" />
                                    <p className="text-sm font-medium">Chưa có cơ hội bán nào được khởi tạo.</p>
                                </div>
                            ) : (
                                <>
                                    {/* Header Labels for visual alignment like the screenshot */}
                                    <div className="grid grid-cols-12 px-6 pb-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        <div className="col-span-4">TÊN CƠ HỘI</div>
                                        <div className="col-span-2 text-center">DÒNG SẢN PHẨM</div>
                                        <div className="col-span-2">SẢN PHẨM</div>
                                        <div className="col-span-2 text-center">QUY TRÌNH</div>
                                        <div className="col-span-2 text-right pr-4">TRẠNG THÁI</div>
                                    </div>

                                    <div className="space-y-3">
                                        {MOCK_OPPORTUNITIES.map(opp => (
                                            <div 
                                                key={opp.id} 
                                                className="grid grid-cols-12 items-center px-6 py-5 bg-white border border-slate-100 rounded-xl hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group/opp"
                                            >
                                                <div className="col-span-4">
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-slate-800 text-[13px] leading-tight mb-1">{opp.name}</span>
                                                        <span className="text-[11px] text-slate-400 font-bold uppercase tracking-tight">{opp.value}</span>
                                                    </div>
                                                </div>
                                                <div className="col-span-2 flex justify-center">
                                                    <span className="px-2.5 py-0.5 rounded bg-slate-50 text-slate-500 text-[9px] font-black uppercase tracking-widest border border-slate-100">
                                                        {opp.productLine}
                                                    </span>
                                                </div>
                                                <div className="col-span-2">
                                                    <span className="text-slate-600 font-medium text-xs truncate block">{opp.product}</span>
                                                </div>
                                                <div className="col-span-2 flex justify-center">
                                                    <span className={`px-2.5 py-1 rounded text-[9px] font-black uppercase tracking-tight border ${getStageColor(opp.stage)}`}>
                                                        {opp.stage}
                                                    </span>
                                                </div>
                                                <div className="col-span-2">
                                                    <div className="flex items-center justify-end gap-2.5 pr-4">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_4px_rgba(34,197,94,0.6)]"></span>
                                                        <span className="text-xs font-bold text-slate-700">{opp.status}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <Modal
                isOpen={isAddYearOpen}
                onClose={() => setIsAddYearOpen(false)}
                title="Add Financial Year"
                maxWidth="max-w-sm"
            >
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-400 uppercase px-1">Year</label>
                        <input 
                            type="number" 
                            value={newYearInput}
                            onChange={(e) => setNewYearInput(e.target.value)}
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="e.g. 2024"
                        />
                    </div>
                    <div className="pt-2 flex justify-end gap-2">
                         <button onClick={() => setIsAddYearOpen(false)} className="px-4 py-2 text-slate-500 text-xs font-bold uppercase tracking-widest">Hủy</button>
                         <button onClick={handleAddYear} disabled={!newYearInput} className="px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg text-xs font-bold uppercase tracking-widest shadow-md disabled:opacity-50 transition-all active:scale-95">Thêm</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default OverviewTab;