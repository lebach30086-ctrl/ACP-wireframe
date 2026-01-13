import React, { useState } from 'react';
import { 
    ChevronLeft, 
    MoreHorizontal, 
    Phone, 
    Trash2, 
    Archive, 
    Clock, 
    AlertCircle, 
    Settings,
    Image as ImageIcon,
    Building2,
    Calendar,
    Bell,
    Link as LinkIcon,
    Unlink,
    Filter,
    ChevronDown,
    ChevronRight,
    Plus,
    Briefcase,
    DollarSign,
    BarChart3
} from 'lucide-react';
import { Company, AccountPlan } from '../types';

interface CompanyDetailProps {
    company: Company;
    onBack: () => void;
    onCreatePlan?: () => void;
    onSelectPlan?: (plan: AccountPlan) => void;
}

// Mock Plans for Company Detail View
const MOCK_COMPANY_PLANS: AccountPlan[] = [
    { 
        id: '1', 
        accountName: 'Digital Transformation 2024', 
        companyId: '1',
        companyName: 'Công ty CP Đầu tư TMZ',
        companySegment: 'Enterprise',
        fiscalYear: 'FY2024', 
        startDate: '2024-01-01',
        endDate: '2024-09-30', 
        owner: 'John Doe', 
        status: 'Active', 
        progress: 65, 
        industry: 'Hospitality', 
        revenue: 1200000, 
        winRate: 45
    },
    { 
        id: '2', 
        accountName: 'Enterprise Licensing Renewal', 
        companyId: '1',
        companyName: 'Công ty CP Đầu tư TMZ',
        companySegment: 'Enterprise',
        fiscalYear: 'FY2024', 
        startDate: '2024-03-01',
        endDate: '2024-10-01', 
        owner: 'John Doe', 
        status: 'Completed', 
        progress: 100, 
        industry: 'Software', 
        revenue: 500000, 
        winRate: 75 
    },
    { 
        id: '3', 
        accountName: 'Cloud Migration Strategy', 
        companyId: '2',
        companyName: 'Globex Inc',
        companySegment: 'Corporate',
        fiscalYear: 'FY2024', 
        startDate: '2024-02-15',
        endDate: '2024-10-15',
        owner: 'Sarah Smith', 
        status: 'Pending Approval', 
        progress: 80, 
        industry: 'Logistics', 
        revenue: 850000, 
        winRate: 60 
    }
];

const CompanyDetail: React.FC<CompanyDetailProps> = ({ company, onBack, onCreatePlan, onSelectPlan }) => {
    const [activeTab, setActiveTab] = useState<'Event' | 'Ghi chú' | 'Công việc' | 'Account Planning'>('Event');

    const companyPlans = MOCK_COMPANY_PLANS.filter(p => p.companyId === company.id);

    const getStatusColor = (status: string) => {
        switch(status) {
            case 'Active': return 'bg-green-100 text-green-700 border-green-200';
            case 'Draft': return 'bg-slate-100 text-slate-700 border-slate-200';
            case 'Pending Approval': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Needs Revision': return 'bg-red-100 text-red-700 border-red-200';
            case 'Completed': return 'bg-slate-200 text-slate-700 border-slate-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            notation: 'compact',
            maximumFractionDigits: 1
        }).format(value);
    };

    return (
        <div className="flex flex-col h-full animate-fade-in">
            {/* Top Bar */}
            <div className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col gap-4">
                <button 
                    onClick={onBack}
                    className="flex items-center gap-1 text-sm text-blue-600 hover:underline w-fit font-medium"
                >
                    <ChevronLeft size={16} /> Quay lại danh sách
                </button>
                
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 border border-slate-200">
                             {company.avatarUrl ? <img src={company.avatarUrl} alt="" className="w-full h-full object-cover rounded-lg" /> : <ImageIcon size={32} />}
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-slate-900 leading-tight mb-1">{company.name}</h1>
                            <div className="flex gap-2">
                                <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-sm font-medium flex items-center gap-2">
                                    Liên hệ <ChevronDown size={14} />
                                </button>
                                <button className="p-1.5 text-slate-500 hover:bg-slate-100 rounded border border-slate-200"><Trash2 size={16} /></button>
                                <button className="p-1.5 text-slate-500 hover:bg-slate-100 rounded border border-slate-200"><Archive size={16} /></button>
                                <button className="p-1.5 text-slate-500 hover:bg-slate-100 rounded border border-slate-200"><ImageIcon size={16} /></button>
                                <button className="p-1.5 text-slate-500 hover:bg-slate-100 rounded border border-slate-200"><MoreHorizontal size={16} /></button>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                         <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded border border-slate-100">
                             <span className="text-xs text-slate-500">Owner:</span>
                             <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold">
                                 {company.owner?.charAt(0) || 'N'}
                             </div>
                             <span className="text-sm font-medium text-slate-700">{company.owner || 'N/A'}</span>
                             <span className="text-xs text-slate-400">({company.ownerEmail || 'email@example.com'})</span>
                         </div>
                         <div className="flex gap-3">
                             <div className="flex items-center gap-1.5 px-3 py-1 bg-orange-50 text-orange-600 rounded text-xs font-medium">
                                 <Clock size={12} /> Sắp tới <span className="font-bold">10</span>
                             </div>
                             <div className="flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-600 rounded text-xs font-medium">
                                 <AlertCircle size={12} /> Quá hạn <span className="font-bold">10</span>
                             </div>
                         </div>
                    </div>
                </div>
            </div>

            {/* Main Content 3-Col Grid */}
            <div className="flex-1 bg-slate-50 overflow-hidden">
                <div className="h-full flex flex-col lg:flex-row">
                    
                    {/* LEFT COLUMN - Company Info */}
                    <div className="w-full lg:w-[320px] bg-white border-r border-slate-200 overflow-y-auto flex-shrink-0">
                        <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="font-bold text-slate-800">Thông tin công ty</h3>
                            <div className="flex gap-1">
                                <button className="p-1 text-slate-400 hover:text-slate-600"><Settings size={16} /></button>
                                <button className="p-1 text-slate-400 hover:text-slate-600"><ChevronRight size={16} /></button>
                            </div>
                        </div>
                        <div className="p-4 space-y-4">
                            <InfoRow label="Người đại diện pháp luật" value={company.legalRepresentative} />
                            <InfoRow label="Địa chỉ" value={company.address || '--'} className="text-xs leading-relaxed" />
                            <InfoRow label="CIF" value={company.cif} />
                            <InfoRow label="Email" value={company.email || '--'} />
                            <InfoRow label="Giới thiệu" value={company.description || '--'} />
                            <InfoRow label="ID công ty" value={`ID${company.id.padEnd(8, '0')}`} />
                            <InfoRow label="Lĩnh vực hoạt động" value={company.industry || '--'} />
                            <InfoRow label="Mã số thuế" value={company.taxCode} />
                            <InfoRow label="Ngày cấp giấy phép ĐKKD" value={company.licenseDate || '--'} />
                            <InfoRow label="Ngày hoạt động" value={company.operatingDate || '--'} />
                            <InfoRow 
                                label="Company Owner" 
                                value={
                                    <div className="flex items-center gap-2 mt-1">
                                         <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold">
                                             {company.owner?.charAt(0) || 'N'}
                                         </div>
                                         <div className="flex flex-col">
                                            <span className="text-xs font-medium">{company.owner || 'N/A'}</span>
                                            <span className="text-[10px] text-slate-400">{company.ownerEmail}</span>
                                         </div>
                                    </div>
                                } 
                            />
                            <InfoRow 
                                label="Đối tác" 
                                value={<span className="text-blue-600 hover:underline cursor-pointer">1 Công ty</span>} 
                            />
                        </div>
                    </div>

                    {/* MIDDLE COLUMN - Tabs Content */}
                    <div className="flex-1 flex flex-col min-w-0 border-r border-slate-200 bg-white">
                        {/* Tabs */}
                        <div className="flex border-b border-slate-200 overflow-x-auto">
                            {['Event', 'Ghi chú', 'Công việc', 'Account Planning'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab as any)}
                                    className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                                >
                                    {tab}
                                </button>
                            ))}
                            <div className="ml-auto p-2">
                                <button className="p-1 text-slate-400 hover:bg-slate-100 rounded"><Settings size={16} /></button>
                            </div>
                        </div>
                        
                        {activeTab === 'Account Planning' ? (
                            <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30">
                                <div className="flex justify-between items-center mb-6">
                                    <div>
                                        <h3 className="font-bold text-slate-800 text-lg">Danh sách kế hoạch</h3>
                                        <p className="text-xs text-slate-500 mt-1">Quản lý các kế hoạch chiến lược cho khách hàng này</p>
                                    </div>
                                    <button 
                                        onClick={onCreatePlan} 
                                        className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-md shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95"
                                    >
                                        <Plus size={16} /> Thêm kế hoạch
                                    </button>
                                </div>

                                {companyPlans.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-64 text-center border-2 border-dashed border-slate-200 rounded-xl bg-white/50">
                                        <Briefcase size={32} className="text-slate-300 mb-3" />
                                        <p className="text-slate-500 font-medium text-sm">Chưa có kế hoạch nào.</p>
                                        <button onClick={onCreatePlan} className="mt-2 text-blue-600 text-sm font-bold hover:underline">Tạo kế hoạch đầu tiên</button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {companyPlans.map(plan => (
                                            <div 
                                                key={plan.id} 
                                                onClick={() => onSelectPlan?.(plan)}
                                                className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group"
                                            >
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <h4 className="font-bold text-slate-800 text-base group-hover:text-blue-600 transition-colors mb-1">{plan.accountName}</h4>
                                                        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                                                            <Calendar size={12} className="text-slate-400" />
                                                            <span>{plan.startDate || 'N/A'} - {plan.endDate || 'N/A'}</span>
                                                        </div>
                                                    </div>
                                                    <span className={`px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-wider border ${getStatusColor(plan.status)}`}>
                                                        {plan.status}
                                                    </span>
                                                </div>
                                                
                                                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
                                                    <div>
                                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                                                            <DollarSign size={10} /> Revenue
                                                        </div>
                                                        <div className="text-sm font-bold text-slate-700">{formatCurrency(plan.revenue)}</div>
                                                    </div>
                                                    <div>
                                                        <div className="flex justify-between items-center mb-1">
                                                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                                                <BarChart3 size={10} /> Progress
                                                            </div>
                                                            <span className="text-[10px] font-bold text-blue-600">{plan.progress}%</span>
                                                        </div>
                                                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                            <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{width: `${plan.progress}%`}}></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                {/* Filters - Shared for other tabs */}
                                <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                                     <div className="bg-white border border-slate-300 rounded px-3 py-1.5 flex items-center gap-2 text-sm text-slate-600 shadow-sm cursor-pointer hover:border-slate-400">
                                         <Calendar size={14} />
                                         <span>01/05/2022 - 30/06/2022</span>
                                     </div>
                                     <div className="flex gap-1">
                                         <button className="p-1.5 bg-white border border-slate-300 rounded text-slate-500 hover:text-slate-700 shadow-sm"><Filter size={14} /></button>
                                         <button className="p-1.5 bg-white border border-slate-300 rounded text-slate-500 hover:text-slate-700 shadow-sm"><ChevronDown size={14} /></button>
                                     </div>
                                </div>

                                {/* Breadcrumb row inside content */}
                                <div className="px-6 py-3 flex justify-between items-center text-xs text-slate-500 border-b border-slate-100">
                                    <div className="flex items-center gap-1 font-medium">
                                        <span>Doanh Nghiệp</span>
                                        <ChevronRight size={12} />
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <ChevronLeft size={12} />
                                        <span>Công ty</span>
                                    </div>
                                </div>

                                {/* Timeline Content */}
                                <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30">
                                    <div className="flex justify-center mb-6">
                                        <span className="bg-slate-200 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Tháng 06/2022</span>
                                    </div>
                                    
                                    <div className="space-y-4 relative before:absolute before:left-[27px] before:top-0 before:bottom-0 before:w-px before:bg-slate-200 before:border-l before:border-dashed">
                                        <TimelineItem 
                                            icon={<Building2 size={16} />} 
                                            title="Tạo Công ty"
                                            subtitle={`Công ty: ${company.name}`}
                                            time="30/06/2022 09:00"
                                        />
                                        <TimelineItem 
                                            icon={<Building2 size={16} />} 
                                            title="Cập nhật thông tin Công ty"
                                            time="30/06/2022 09:00"
                                        />
                                        <TimelineItem 
                                            icon={<LinkIcon size={16} />} 
                                            title="Gắn liên hệ giữa Công ty và Cơ hội bán"
                                            time="30/06/2022 09:00"
                                        />
                                        <TimelineItem 
                                            icon={<Bell size={16} />} 
                                            title="Gửi Push in-app đến Nguyễn Đặng Khánh Linh"
                                            subtitle="Mobile App: MOBIOSHOP"
                                            time="30/06/2022 09:00"
                                        />
                                        <TimelineItem 
                                            icon={<Unlink size={16} />} 
                                            title="Gỡ liên hệ giữa Công ty và Cơ hội bán"
                                            time="30/06/2022 09:00"
                                        />
                                        <TimelineItem 
                                            icon={<LinkIcon size={16} />} 
                                            title="Gắn liên hệ giữa Công ty và Ticket"
                                            time="30/06/2022 09:00"
                                        />
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* RIGHT COLUMN - Related Items */}
                    <div className="w-full lg:w-[280px] bg-white border-l border-slate-200 overflow-y-auto flex-shrink-0">
                        <RightSidebarSection title="Media" />
                        <RightSidebarSection title="Cơ hội bán" />
                        <RightSidebarSection title="Ticket" />
                        <RightSidebarSection title="Profiles" />
                        <RightSidebarSection title="Đối tác" />
                    </div>
                </div>
            </div>
        </div>
    );
};

const InfoRow: React.FC<{ label: string; value: React.ReactNode; className?: string }> = ({ label, value, className = '' }) => (
    <div className="group">
        <label className="text-xs text-slate-500 block mb-1">{label}</label>
        <div className={`text-sm text-slate-800 font-medium ${className}`}>{value}</div>
        <div className="h-px bg-slate-50 mt-2 group-last:hidden"></div>
    </div>
);

const TimelineItem: React.FC<{ icon: React.ReactNode; title: string; subtitle?: string; time: string }> = ({ icon, title, subtitle, time }) => (
    <div className="flex gap-4 relative z-10 group">
        <div className="w-14 flex-shrink-0 flex justify-center">
            <div className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:border-blue-200 transition-colors">
                {icon}
            </div>
        </div>
        <div className="flex-1 bg-white p-3 rounded-lg border border-slate-200 shadow-sm group-hover:border-blue-300 transition-colors">
            <div className="flex justify-between items-start gap-2">
                <h4 className="text-sm font-semibold text-slate-800">{title}</h4>
            </div>
            {subtitle && <p className="text-xs text-slate-600 mt-1">{subtitle}</p>}
            <p className="text-[10px] text-slate-400 mt-2">{time}</p>
        </div>
    </div>
);

const RightSidebarSection: React.FC<{ title: string }> = ({ title }) => (
    <div className="border-b border-slate-100">
        <button className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors group">
            <div className="flex items-center gap-2">
                <ChevronRight size={14} className="text-slate-400 group-hover:text-slate-600" />
                <span className="text-sm font-semibold text-slate-700">{title}</span>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Settings size={14} className="text-slate-400 hover:text-blue-600" />
                <Plus size={14} className="text-slate-400 hover:text-blue-600" />
            </div>
        </button>
    </div>
);

export default CompanyDetail;