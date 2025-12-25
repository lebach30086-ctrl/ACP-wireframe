
import React, { useState } from 'react';
import { 
    ResponsiveContainer, 
    AreaChart, 
    Area, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
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
    AlertTriangle,
    ChevronDown,
    ArrowRight,
    Package
} from 'lucide-react';
import { AccountPlan } from '../../types';
import Modal from '../ui/Modal';

interface OverviewTabProps {
    plan: AccountPlan;
    onUpdatePlan: (fields: Partial<AccountPlan>) => void;
}

const REVENUE_DATA = [
    { month: 'Q1', actual: 120, target: 150 },
    { month: 'Q2', actual: 180, target: 160 },
    { month: 'Q3', actual: 240, target: 200 },
    { month: 'Q4', actual: null, target: 300 }, // Projected
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

const OverviewTab: React.FC<OverviewTabProps> = ({ plan, onUpdatePlan }) => {
    const isNew = plan.isNew;
    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
    
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

    const toggleGroup = (group: string) => {
        setExpandedGroups(prev => ({...prev, [group]: !prev[group]}));
    };

    // Form State
    const [profileForm, setProfileForm] = useState({
        industry: plan.industry || '',
        employees: plan.employees || '',
        location: plan.location || '',
        tier: plan.tier || 'Strategic',
        taxCode: plan.taxCode || '',
        legalRepresentative: plan.legalRepresentative || '',
    });

    const handleProfileSave = () => {
        onUpdatePlan(profileForm);
        setIsEditProfileOpen(false);
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
            // Sort ascending (oldest to newest)
            const updatedRecords = [...financialRecords, newRecord].sort((a,b) => a.year.localeCompare(b.year));
            setFinancialRecords(updatedRecords);
            setActiveYear(newYearInput);
            setIsAddYearOpen(false);
            setNewYearInput('');
            setIsEditingFinance(true); // Automatically enter edit mode for new year
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
                <div className="flex items-center py-2">
                    <label className="w-1/3 text-sm text-slate-500">{label}</label>
                    <div className="flex-1">
                        <input 
                            type="text" 
                            value={value}
                            onChange={(e) => updateFinancialRecord(field, e.target.value)}
                            className="w-full px-3 py-2 border border-neutral-200 rounded-[6px] bg-white text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                        />
                    </div>
                </div>
            );
        }

        return (
            <div className="flex justify-between items-center pb-2 border-b border-slate-100 last:border-0">
                <span className="text-slate-500 text-sm">{label}</span>
                <span className="font-medium text-slate-800 text-right">{value || '--'}</span>
            </div>
        );
    };

    // Action Plan Data
    const taskStats = {
        completed: 12,
        inProgress: 5,
        overdue: 2,
        toDo: 8
    };
    const totalTasks = taskStats.completed + taskStats.inProgress + taskStats.toDo + taskStats.overdue;

    return (
        <div className="grid grid-cols-12 gap-6 animate-fade-in">
            {/* Left Column */}
            <div className="col-span-12 lg:col-span-4 space-y-6">
                {/* Account Profile */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative group">
                    <button 
                        onClick={() => {
                            setProfileForm({
                                industry: plan.industry || '',
                                employees: plan.employees || '',
                                location: plan.location || '',
                                tier: plan.tier || 'Strategic',
                                taxCode: plan.taxCode || '',
                                legalRepresentative: plan.legalRepresentative || '',
                            });
                            setIsEditProfileOpen(true);
                        }}
                        className={`absolute top-4 right-4 p-1.5 rounded transition-colors ${isNew ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-50 hover:text-blue-600 opacity-0 group-hover:opacity-100'}`}
                    >
                        {isNew ? <Plus size={16} /> : <Edit2 size={16} />}
                    </button>
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Building size={20} className="text-blue-600"/> 
                        Account Profile
                    </h3>
                    
                    {isNew && !plan.industry && !plan.location ? (
                         <div className="flex flex-col items-center justify-center py-6 text-slate-400 border border-dashed border-slate-200 rounded-lg">
                            <p className="text-sm">Profile incomplete</p>
                            <button onClick={() => setIsEditProfileOpen(true)} className="text-blue-600 text-sm font-medium hover:underline">Complete Profile</button>
                         </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                                <span className="text-slate-500 text-sm">Industry</span>
                                <span className="font-medium text-slate-800">{plan.industry || 'Not set'}</span>
                            </div>
                            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                                <span className="text-slate-500 text-sm">Tax Code</span>
                                <span className="font-medium text-slate-800 font-mono">{plan.taxCode || (isNew ? '-' : '0300300300')}</span>
                            </div>
                             <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                                <span className="text-slate-500 text-sm">Legal Representative</span>
                                <button className="font-medium text-blue-600 hover:underline hover:text-blue-800 transition-colors">
                                    {plan.legalRepresentative || (isNew ? '-' : 'Mrs. Hoa')}
                                </button>
                            </div>
                            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                                <span className="text-slate-500 text-sm">Employees</span>
                                <span className="font-medium text-slate-800">{plan.employees || (isNew ? '-' : '5,000+')}</span>
                            </div>
                            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                                <span className="text-slate-500 text-sm">HQ Location</span>
                                <span className="font-medium text-slate-800">{plan.location || (isNew ? '-' : 'San Francisco, CA')}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-500 text-sm">Tier</span>
                                <span className={`px-2 py-0.5 rounded text-xs font-bold ${plan.tier === 'Strategic' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
                                    {plan.tier || (isNew ? 'Unassigned' : 'Strategic')}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Product Holding */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative">
                    <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <Package size={20} className="text-blue-600" />
                        Product Holding
                    </h3>

                    <div className="space-y-6">
                        {/* Header with Donut */}
                        <div className="flex items-center gap-4">
                            <div className="relative w-20 h-20 flex-shrink-0">
                                {/* SVG Donut Chart */}
                                <svg viewBox="0 0 100 100" className="transform -rotate-90 w-full h-full">
                                    <circle cx="50" cy="50" r="40" stroke="#f1f5f9" strokeWidth="6" fill="none" />
                                    {/* Active (Green) - 2/6 */}
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
                                    {/* Expired (Red) - 1/6 */}
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
                                    {/* Unused (Gray) - 3/6 */}
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
                            <div className="font-medium text-slate-800 text-lg">
                                Dòng sản phẩm đang sử dụng
                            </div>
                        </div>

                        {/* Groups */}
                        <div className="space-y-4">
                            {/* Active Group */}
                            <div>
                                <button onClick={() => toggleGroup('active')} className="w-full flex items-center justify-between mb-3 group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center shadow-sm">
                                            <Check size={12} strokeWidth={3} />
                                        </div>
                                        <span className="font-medium text-slate-800 text-sm">Đang sử dụng</span>
                                        <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 text-xs font-bold flex items-center justify-center">2</span>
                                    </div>
                                    <ChevronDown size={16} className={`text-slate-400 transition-transform duration-200 ${expandedGroups['active'] ? 'rotate-180' : ''}`} />
                                </button>
                                {expandedGroups['active'] && (
                                    <div className="pl-8 space-y-3 animate-in slide-in-from-top-2 duration-200">
                                        <div className="flex items-center justify-between group/item cursor-pointer p-2 hover:bg-slate-50 rounded-lg -ml-2 transition-colors">
                                            <div>
                                                <div className="text-sm font-medium text-slate-800">Eximbank EDigi</div>
                                                <div className="text-xs text-slate-400 uppercase mt-0.5">EBANK</div>
                                            </div>
                                            <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 opacity-0 group-hover/item:opacity-100 group-hover/item:bg-white group-hover/item:shadow-sm group-hover/item:text-blue-600 transition-all">
                                                <ArrowRight size={16} />
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between group/item cursor-pointer p-2 hover:bg-slate-50 rounded-lg -ml-2 transition-colors">
                                            <div>
                                                <div className="text-sm font-medium text-slate-800">Bảo hiểm</div>
                                                <div className="text-xs text-slate-400 uppercase mt-0.5">BAO HIEM</div>
                                            </div>
                                            <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 opacity-0 group-hover/item:opacity-100 group-hover/item:bg-white group-hover/item:shadow-sm group-hover/item:text-blue-600 transition-all">
                                                <ArrowRight size={16} />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Expired Group */}
                            <div>
                                <button onClick={() => toggleGroup('expired')} className="w-full flex items-center justify-between mb-3 group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center shadow-sm">
                                            <X size={12} strokeWidth={3} />
                                        </div>
                                        <span className="font-medium text-slate-800 text-sm">Hết hạn</span>
                                        <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 text-xs font-bold flex items-center justify-center">1</span>
                                    </div>
                                    <ChevronDown size={16} className={`text-slate-400 transition-transform duration-200 ${expandedGroups['expired'] ? 'rotate-180' : ''}`} />
                                </button>
                                {expandedGroups['expired'] && (
                                    <div className="pl-8 space-y-3 animate-in slide-in-from-top-2 duration-200">
                                        <div className="flex items-center justify-between group/item cursor-pointer p-2 hover:bg-slate-50 rounded-lg -ml-2 transition-colors">
                                            <div>
                                                <div className="text-sm font-medium text-slate-800">Cho vay</div>
                                                <div className="text-xs text-slate-400 uppercase mt-0.5">Vay kinh doanh</div>
                                            </div>
                                            <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 opacity-0 group-hover/item:opacity-100 group-hover/item:bg-white group-hover/item:shadow-sm group-hover/item:text-blue-600 transition-all">
                                                <ArrowRight size={16} />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Unused Group */}
                            <div>
                                <button onClick={() => toggleGroup('unused')} className="w-full flex items-center justify-between mb-3 group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-5 h-5 rounded-full bg-slate-300 text-white flex items-center justify-center shadow-sm">
                                            <AlertTriangle size={10} fill="white" strokeWidth={0} />
                                        </div>
                                        <span className="font-medium text-slate-800 text-sm">Chưa sử dụng</span>
                                        <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 text-xs font-bold flex items-center justify-center">3</span>
                                    </div>
                                    <ChevronDown size={16} className={`text-slate-400 transition-transform duration-200 ${expandedGroups['unused'] ? 'rotate-180' : ''}`} />
                                </button>
                                {expandedGroups['unused'] && (
                                    <div className="pl-8 space-y-3 animate-in slide-in-from-top-2 duration-200">
                                        <div className="p-2 -ml-2">
                                            <div className="text-sm font-medium text-slate-800">Chuyển - nhận tiền nước ngoài</div>
                                            <div className="text-xs text-slate-400 uppercase mt-0.5">TRANSFER</div>
                                        </div>
                                        <div className="p-2 -ml-2">
                                            <div className="text-sm font-medium text-slate-800">Huy động vốn</div>
                                            <div className="text-xs text-slate-400 uppercase mt-0.5">HUY DONG VON</div>
                                        </div>
                                         <div className="p-2 -ml-2">
                                            <div className="text-sm font-medium text-slate-800">Thẻ</div>
                                            <div className="text-xs text-slate-400 uppercase mt-0.5">DEBIT</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Financial Situation */}
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
                                className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Edit2 size={16} /> Edit
                            </button>
                        )}
                    </div>
                    
                    <div className="pt-0">
                        {/* Year Tabs */}
                        <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
                            {financialRecords.map(record => (
                                <button
                                    key={record.year}
                                    onClick={() => { setActiveYear(record.year); setIsEditingFinance(false); }}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap
                                        ${activeYear === record.year 
                                            ? 'bg-blue-50 text-blue-600' 
                                            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                                        }`}
                                >
                                    {record.year}
                                </button>
                            ))}
                            <button 
                                onClick={() => setIsAddYearOpen(true)}
                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Add Year"
                            >
                                <Plus size={16} />
                            </button>
                        </div>
                        
                        {/* Divider with Actions */}
                        {isEditingFinance && (
                            <div className="flex justify-end mb-4">
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => setIsEditingFinance(false)}
                                        className="text-xs flex items-center gap-1 px-3 py-1.5 rounded-[6px] text-slate-500 hover:bg-slate-100 font-medium"
                                    >
                                        <X size={14} /> Cancel
                                    </button>
                                    <button 
                                        onClick={() => setIsEditingFinance(false)}
                                        className="text-xs flex items-center gap-1 px-3 py-1.5 rounded-[6px] bg-blue-100 text-blue-600 hover:bg-blue-200 font-medium border border-blue-200"
                                    >
                                        <Save size={14} /> Save
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Data Fields */}
                        <div className="space-y-4">
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
                                <div className="p-8 text-center text-slate-400 text-sm">
                                    Select or add a year to view data
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* 1.4.3 & 1.4.4 Center/Right Column */}
            <div className="col-span-12 lg:col-span-8 space-y-6">
                {/* Metrics */}
                 <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-2 text-slate-500 mb-2">
                            <Target size={16} />
                            <span className="text-xs font-bold uppercase">Win Rate</span>
                        </div>
                        <div className="text-2xl font-bold text-slate-800">{plan.winRate}%</div>
                        {!isNew && (
                            <div className="text-xs text-green-600 flex items-center gap-1">
                                <Save size={12} className="hidden" /> 
                                {/* Using simple trending up logic if needed, but keeping it clean */}
                                +5% vs LY
                            </div>
                        )}
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-2 text-slate-500 mb-2">
                            <Award size={16} />
                            <span className="text-xs font-bold uppercase">Health Score</span>
                        </div>
                        <div className={`text-2xl font-bold ${isNew ? 'text-slate-300' : 'text-green-600'}`}>
                            {isNew ? '-' : '85'}
                        </div>
                        {!isNew && <div className="text-xs text-slate-400">Finance Health</div>}
                    </div>
                </div>

                 {/* 1.4.4 Revenue Performance */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm min-h-[300px] flex flex-col relative group">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                <DollarSign size={20} className="text-green-600" />
                                Revenue Performance
                            </h3>
                            <p className="text-sm text-slate-500">Actual vs Target (k USD)</p>
                        </div>
                        {!isNew && (
                            <div className="flex gap-2">
                                <div className="flex items-center gap-2 text-xs">
                                    <span className="w-3 h-3 bg-blue-500 rounded-full"></span> Actual
                                </div>
                                <div className="flex items-center gap-2 text-xs">
                                    <span className="w-3 h-3 bg-slate-300 rounded-full"></span> Target
                                </div>
                            </div>
                        )}
                    </div>
                    
                    <div className="flex-1">
                        {isNew ? (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-100 rounded-xl">
                                <div className="bg-slate-50 p-4 rounded-full mb-3">
                                    <BarChart2 size={32} />
                                </div>
                                <p className="text-sm font-medium">No revenue data recorded</p>
                            </div>
                        ) : (
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={REVENUE_DATA}>
                                        <defs>
                                            <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                                        <Tooltip 
                                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 / 0.1)' }}
                                        />
                                        <Area type="monotone" dataKey="actual" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorActual)" />
                                        <Area type="monotone" dataKey="target" stroke="#cbd5e1" strokeWidth={2} strokeDasharray="5 5" fill="none" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </div>
                </div>

                {/* Action Plan Progress */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                         <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                             <CheckSquare size={20} className="text-blue-600" />
                             Action Plan Progress
                         </h3>
                         <button className="text-xs text-blue-600 hover:underline font-medium">View Details</button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Left: Overall Stats with Donut */}
                        <div className="space-y-6">
                             <div>
                                <div className="flex justify-between text-sm font-medium text-slate-700 mb-2">
                                    <span>Overall Completion</span>
                                    <span className="text-blue-600">{plan.progress}%</span>
                                </div>
                                <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-blue-600 rounded-full transition-all duration-1000" 
                                        style={{ width: `${plan.progress}%` }}
                                    ></div>
                                </div>
                             </div>

                             <div className="flex flex-col sm:flex-row items-center gap-8">
                                <div className="relative w-32 h-32 flex-shrink-0">
                                    <svg viewBox="0 0 100 100" className="transform -rotate-90 w-full h-full">
                                        <circle cx="50" cy="50" r="40" stroke="#f1f5f9" strokeWidth="8" fill="none" />
                                        
                                        {/* Completed (Green) */}
                                        <circle 
                                            cx="50" cy="50" r="40" stroke="#22c55e" strokeWidth="8" fill="none" 
                                            strokeDasharray={`${(taskStats.completed/totalTasks)*251.2} 251.2`}
                                            strokeDashoffset="0"
                                            strokeLinecap="round" 
                                        />
                                        {/* In Progress (Blue) */}
                                        <circle 
                                            cx="50" cy="50" r="40" stroke="#3b82f6" strokeWidth="8" fill="none" 
                                            strokeDasharray={`${(taskStats.inProgress/totalTasks)*251.2} 251.2`}
                                            strokeDashoffset={`-${(taskStats.completed/totalTasks)*251.2}`}
                                            strokeLinecap="round" 
                                        />
                                        {/* Overdue (Red) - Reordered before To Do */}
                                        <circle 
                                            cx="50" cy="50" r="40" stroke="#ef4444" strokeWidth="8" fill="none" 
                                            strokeDasharray={`${(taskStats.overdue/totalTasks)*251.2} 251.2`}
                                            strokeDashoffset={`-${((taskStats.completed + taskStats.inProgress)/totalTasks)*251.2}`}
                                            strokeLinecap="round" 
                                        />
                                        {/* To Do (Light Grey) */}
                                        <circle 
                                            cx="50" cy="50" r="40" stroke="#cbd5e1" strokeWidth="8" fill="none" 
                                            strokeDasharray={`${(taskStats.toDo/totalTasks)*251.2} 251.2`}
                                            strokeDashoffset={`-${((taskStats.completed + taskStats.inProgress + taskStats.overdue)/totalTasks)*251.2}`}
                                            strokeLinecap="round" 
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-2xl font-bold text-slate-800">{totalTasks}</span>
                                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total</span>
                                    </div>
                                </div>

                                <div className="flex-1 w-full grid grid-cols-2 gap-x-6 gap-y-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Completed</div>
                                        </div>
                                        <div className="text-sm font-bold text-slate-800 ml-3.5">{taskStats.completed}</div>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">In Progress</div>
                                        </div>
                                        <div className="text-sm font-bold text-slate-800 ml-3.5">{taskStats.inProgress}</div>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Overdue</div>
                                        </div>
                                        <div className="text-sm font-bold text-slate-800 ml-3.5">{taskStats.overdue}</div>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">To Do</div>
                                        </div>
                                        <div className="text-sm font-bold text-slate-800 ml-3.5">{taskStats.toDo}</div>
                                    </div>
                                </div>
                             </div>
                        </div>

                        {/* Right: Upcoming Priorities */}
                        <div className="border-l border-slate-100 pl-0 md:pl-8">
                            <h4 className="text-sm font-bold text-slate-800 mb-4">Upcoming Priorities</h4>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 shrink-0"></div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-slate-800 truncate">Finalize Q3 Contract</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[10px] text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200">Due Tomorrow</span>
                                            <div className="w-4 h-4 rounded-full bg-blue-100 text-blue-600 text-[10px] flex items-center justify-center font-bold">JD</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0"></div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-slate-800 truncate">Executive Briefing Prep</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[10px] text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200">Due Oct 25</span>
                                            <div className="w-4 h-4 rounded-full bg-purple-100 text-purple-600 text-[10px] flex items-center justify-center font-bold">SM</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0"></div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-slate-800 truncate">Stakeholder Interview</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[10px] text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200">Done</span>
                                            <div className="w-4 h-4 rounded-full bg-blue-100 text-blue-600 text-[10px] flex items-center justify-center font-bold">JD</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <Modal
                isOpen={isEditProfileOpen}
                onClose={() => setIsEditProfileOpen(false)}
                title="Edit Account Profile"
            >
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Industry</label>
                        <input 
                            type="text"
                            value={profileForm.industry}
                            onChange={(e) => setProfileForm({...profileForm, industry: e.target.value})}
                            className="w-full px-3 py-2 border border-neutral-300 bg-white text-slate-900 rounded-[6px] placeholder-slate-400 focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="e.g. Technology"
                        />
                    </div>
                     <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Tax Code</label>
                        <input 
                            type="text"
                            value={profileForm.taxCode}
                            onChange={(e) => setProfileForm({...profileForm, taxCode: e.target.value})}
                            className="w-full px-3 py-2 border border-neutral-300 bg-white text-slate-900 rounded-[6px] placeholder-slate-400 focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="e.g. 0300300300"
                        />
                    </div>
                     <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Legal Representative</label>
                        <input 
                            type="text"
                            value={profileForm.legalRepresentative}
                            onChange={(e) => setProfileForm({...profileForm, legalRepresentative: e.target.value})}
                            className="w-full px-3 py-2 border border-neutral-300 bg-white text-slate-900 rounded-[6px] placeholder-slate-400 focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="e.g. John Doe"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Employees</label>
                        <input 
                            type="text"
                            value={profileForm.employees}
                            onChange={(e) => setProfileForm({...profileForm, employees: e.target.value})}
                            className="w-full px-3 py-2 border border-neutral-300 bg-white text-slate-900 rounded-[6px] placeholder-slate-400 focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="e.g. 5,000+"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">HQ Location</label>
                        <input 
                            type="text"
                            value={profileForm.location}
                            onChange={(e) => setProfileForm({...profileForm, location: e.target.value})}
                            className="w-full px-3 py-2 border border-neutral-300 bg-white text-slate-900 rounded-[6px] placeholder-slate-400 focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="e.g. New York, NY"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Account Tier</label>
                        <select
                             value={profileForm.tier}
                             onChange={(e) => setProfileForm({...profileForm, tier: e.target.value})}
                             className="w-full px-3 py-2 border border-neutral-300 bg-white text-slate-900 rounded-[6px] focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option value="Strategic">Strategic</option>
                            <option value="Growth">Growth</option>
                            <option value="Maintenance">Maintenance</option>
                        </select>
                    </div>
                    <div className="pt-4 flex justify-end gap-3">
                        <button onClick={() => setIsEditProfileOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-[6px] font-medium">Cancel</button>
                        <button onClick={handleProfileSave} className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-[6px] font-medium">Save Changes</button>
                    </div>
                </div>
            </Modal>
            
            <Modal
                isOpen={isAddYearOpen}
                onClose={() => setIsAddYearOpen(false)}
                title="Add Financial Year"
                maxWidth="max-w-sm"
            >
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Year</label>
                        <input 
                            type="number" 
                            value={newYearInput}
                            onChange={(e) => setNewYearInput(e.target.value)}
                            className="w-full px-3 py-2 border border-neutral-300 bg-white text-slate-900 rounded-[6px] focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="e.g. 2024"
                        />
                    </div>
                    <div className="pt-2 flex justify-end gap-2">
                         <button onClick={() => setIsAddYearOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-[6px] font-medium text-sm">Cancel</button>
                         <button onClick={handleAddYear} disabled={!newYearInput} className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-[6px] font-medium text-sm disabled:opacity-50">Add Year</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default OverviewTab;
