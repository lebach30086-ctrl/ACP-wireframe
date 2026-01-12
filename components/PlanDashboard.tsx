import React, { useState, useRef, useEffect } from 'react';
import { 
    ChevronLeft, 
    Download, 
    MoreHorizontal, 
    Edit2, 
    Calendar, 
    Save, 
    Settings, 
    Trash2, 
    ChevronDown, 
    ChevronUp,
    GripVertical
} from 'lucide-react';
import { AccountPlan, PlanTab } from '../types';
import OverviewTab from './dashboard/OverviewTab';
import MarketTab from './dashboard/MarketTab';
import StrategyTab from './dashboard/StrategyTab';
import ExecutionTab from './dashboard/ExecutionTab';
import ApprovalTab from './dashboard/ApprovalTab';
import ExportModal from './ExportModal';
import Modal from './ui/Modal';

interface PlanDashboardProps {
    plan: AccountPlan;
    onBack: () => void;
    onUpdatePlan: (fields: Partial<AccountPlan>) => void;
}

interface SectionConfig {
    id: string;
    label: string;
    visible: boolean;
}

interface TabConfig {
    id: PlanTab;
    label: string;
    visible: boolean;
    sections: SectionConfig[];
}

const INITIAL_TABS_CONFIG: TabConfig[] = [
    {
        id: PlanTab.OVERVIEW,
        label: 'Overview & Performance',
        visible: true,
        sections: [
            { id: 'profile', label: 'Account Profile', visible: true },
            { id: 'product_holding', label: 'Product Holding', visible: true },
            { id: 'financial', label: 'Tình hình tài chính', visible: true },
            { id: 'action_progress', label: 'Action Plan Progress', visible: true },
            { id: 'revenue', label: 'Revenue Performance', visible: true },
            { id: 'opportunities', label: 'Cơ hội bán', visible: true },
        ]
    },
    {
        id: PlanTab.STAKEHOLDERS,
        label: 'Stakeholder Map',
        visible: true,
        sections: []
    },
    {
        id: PlanTab.ANALYSIS,
        label: 'Strategic Analysis',
        visible: true,
        sections: [
            { id: 'industry', label: 'Industry & Market Analysis', visible: true },
            { id: 'swot', label: 'SWOT Matrix', visible: true },
            { id: 'risk_competitor', label: 'Risk & Competitive Landscape', visible: true },
            { id: 'whitespace', label: 'Whitespace Analysis', visible: true },
        ]
    },
    {
        id: PlanTab.ACTION_PLAN,
        label: 'Action Plan & Tracking',
        visible: true,
        sections: []
    },
    {
        id: PlanTab.APPROVAL,
        label: 'Approval',
        visible: true,
        sections: []
    }
];

const PlanDashboard: React.FC<PlanDashboardProps> = ({ plan, onBack, onUpdatePlan }) => {
    const [activeTab, setActiveTab] = useState<PlanTab>(PlanTab.OVERVIEW);
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    const [isEditMainInfoModalOpen, setIsEditMainInfoModalOpen] = useState(false);
    
    // Config View State
    const [tabsConfig, setTabsConfig] = useState<TabConfig[]>(INITIAL_TABS_CONFIG);
    const [isMorePopoverOpen, setIsMorePopoverOpen] = useState(false);
    const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
    const [tempTabsConfig, setTempTabsConfig] = useState<TabConfig[]>([]);
    const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);
    const popoverRef = useRef<HTMLDivElement>(null);

    const formatCurrencyInput = (value: number) => {
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    // Form state for main info
    const [editForm, setEditForm] = useState({
        accountName: plan.accountName,
        startDate: plan.startDate || '',
        endDate: plan.endDate || '',
        revenue: plan.revenue ? formatCurrencyInput(plan.revenue) : '',
        description: plan.description || ''
    });

    // Close popover when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
                setIsMorePopoverOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'Active': return 'bg-green-100 text-green-700 border-green-200';
            case 'Draft': return 'bg-slate-100 text-slate-700 border-slate-200';
            case 'Pending Approval': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Needs Revision': return 'bg-red-100 text-red-700 border-red-200';
            case 'Completed': return 'bg-slate-200 text-slate-700 border-slate-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    const formatDateRange = (start?: string, end?: string) => {
        if (!start || !end) return plan.fiscalYear || 'No Period Set';
        const s = new Date(start).toLocaleDateString('vi-VN');
        const e = new Date(end).toLocaleDateString('vi-VN');
        return `${s} - ${e}`;
    };

    const handleSaveMainInfo = () => {
        onUpdatePlan({
            ...editForm,
            revenue: parseFloat(editForm.revenue.replace(/\./g, '')) || 0
        });
        setIsEditMainInfoModalOpen(false);
    };

    const handleRevenueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value.replace(/\./g, '').replace(/\D/g, '');
        const formattedValue = rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        setEditForm(prev => ({ ...prev, revenue: formattedValue }));
    };

    const openEditModal = () => {
        setEditForm({
            accountName: plan.accountName,
            startDate: plan.startDate || '',
            endDate: plan.endDate || '',
            revenue: plan.revenue ? formatCurrencyInput(plan.revenue) : '',
            description: plan.description || ''
        });
        setIsEditMainInfoModalOpen(true);
    };

    // Configuration Handlers
    const openConfigModal = () => {
        setTempTabsConfig(JSON.parse(JSON.stringify(tabsConfig))); // Deep copy
        setIsConfigModalOpen(true);
        setIsMorePopoverOpen(false);
    };

    const handleSaveConfig = () => {
        setTabsConfig(tempTabsConfig);
        setIsConfigModalOpen(false);
        // If current active tab becomes hidden, switch to the first visible one
        const currentTabVisible = tempTabsConfig.find(t => t.id === activeTab)?.visible;
        if (!currentTabVisible) {
            const firstVisible = tempTabsConfig.find(t => t.visible);
            if (firstVisible) setActiveTab(firstVisible.id);
        }
    };

    const toggleTabVisibility = (index: number) => {
        const newConfig = [...tempTabsConfig];
        newConfig[index].visible = !newConfig[index].visible;
        setTempTabsConfig(newConfig);
    };

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
        setDraggedItemIndex(index);
        e.dataTransfer.effectAllowed = "move";
        // To avoid ghost image issues or customize it, can set dataTransfer.setDragImage here
    };

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>, index: number) => {
        if (draggedItemIndex === null || draggedItemIndex === index) return;
        
        const newConfig = [...tempTabsConfig];
        const draggedItem = newConfig[draggedItemIndex];
        newConfig.splice(draggedItemIndex, 1);
        newConfig.splice(index, 0, draggedItem);
        
        setTempTabsConfig(newConfig);
        setDraggedItemIndex(index);
    };

    const handleDragEnd = () => {
        setDraggedItemIndex(null);
    };

    const toggleSectionVisibility = (tabIndex: number, sectionIndex: number) => {
        const newConfig = [...tempTabsConfig];
        newConfig[tabIndex].sections[sectionIndex].visible = !newConfig[tabIndex].sections[sectionIndex].visible;
        setTempTabsConfig(newConfig);
    };

    // Get visible sections for current tab
    const currentTabConfig = tabsConfig.find(t => t.id === activeTab);
    const visibleSections = currentTabConfig?.sections.reduce((acc, sec) => {
        acc[sec.id] = sec.visible;
        return acc;
    }, {} as Record<string, boolean>) || {};

    const [expandedTabConfig, setExpandedTabConfig] = useState<Record<string, boolean>>({});
    const toggleConfigExpand = (id: string) => {
        setExpandedTabConfig(prev => ({...prev, [id]: !prev[id]}));
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col space-y-4">
                <button 
                    onClick={onBack}
                    className="flex items-center gap-1 text-sm text-slate-500 hover:text-blue-600 transition-colors w-fit font-medium"
                >
                    <ChevronLeft size={16} /> Back to List
                </button>
                
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-200 pb-4">
                    <div className="group relative">
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-3xl font-bold text-slate-900">{plan.accountName}</h1>
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border uppercase tracking-wide ${getStatusStyles(plan.status)}`}>
                                {plan.status}
                            </span>
                            <button 
                                onClick={openEditModal}
                                className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                title="Edit Plan Info"
                            >
                                <Edit2 size={18} />
                            </button>
                        </div>
                        <p className="text-slate-500 flex items-center gap-2">
                            <span>{formatDateRange(plan.startDate, plan.endDate)}</span>
                            <span className="w-1 h-1 bg-slate-400 rounded-full"></span>
                            <span>Owned by {plan.owner}</span>
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <button 
                            onClick={() => setIsExportModalOpen(true)}
                            className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors" 
                            title="Download Account Plan"
                        >
                            <Download size={20} />
                        </button>
                        
                        <div className="relative" ref={popoverRef}>
                            <button 
                                onClick={() => setIsMorePopoverOpen(!isMorePopoverOpen)}
                                className={`p-2 rounded-lg transition-colors ${isMorePopoverOpen ? 'bg-slate-100 text-slate-800' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'}`}
                            >
                                <MoreHorizontal size={20} />
                            </button>
                            
                            {isMorePopoverOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                    <button 
                                        onClick={openConfigModal}
                                        className="w-full px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 text-left font-medium transition-colors border-b border-slate-50"
                                    >
                                        <Settings size={16} /> Sắp xếp hiển thị
                                    </button>
                                    <button 
                                        onClick={() => {
                                            alert("Delete functionality to be implemented");
                                            setIsMorePopoverOpen(false);
                                        }}
                                        className="w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 text-left font-medium transition-colors"
                                    >
                                        <Trash2 size={16} /> Xóa plan
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex gap-6 border-b border-slate-200 overflow-x-auto">
                    {tabsConfig.filter(t => t.visible).map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as PlanTab)}
                            className={`pb-3 text-sm font-medium transition-all relative whitespace-nowrap px-1
                                ${activeTab === tab.id ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'}
                            `}
                        >
                            {tab.label}
                            {activeTab === tab.id && (
                                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full"></span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            <div className="min-h-[500px]">
                {activeTab === PlanTab.OVERVIEW && <OverviewTab plan={plan} onUpdatePlan={onUpdatePlan} onTabChange={setActiveTab} visibleSections={visibleSections} />}
                {activeTab === PlanTab.ANALYSIS && <MarketTab plan={plan} visibleSections={visibleSections} />}
                {activeTab === PlanTab.STAKEHOLDERS && <StrategyTab plan={plan} />}
                {activeTab === PlanTab.ACTION_PLAN && <ExecutionTab plan={plan} />}
                {activeTab === PlanTab.APPROVAL && <ApprovalTab plan={plan} onUpdatePlan={onUpdatePlan} />}
            </div>

            <ExportModal 
                isOpen={isExportModalOpen} 
                onClose={() => setIsExportModalOpen(false)} 
                plan={plan} 
            />

            {/* Modal Edit Main Info */}
            <Modal
                isOpen={isEditMainInfoModalOpen}
                onClose={() => setIsEditMainInfoModalOpen(false)}
                title="Cập nhật kế hoạch"
                maxWidth="max-w-lg"
            >
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">TÊN KẾ HOẠCH <span className="text-red-500">*</span></label>
                        <input 
                            type="text" 
                            value={editForm.accountName}
                            onChange={(e) => setEditForm({...editForm, accountName: e.target.value})}
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white text-slate-900 font-bold text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
                            placeholder="Nhập tên kế hoạch..."
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">DOANH THU MỤC TIÊU</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                            <input 
                                type="text" 
                                value={editForm.revenue}
                                onChange={handleRevenueChange}
                                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl bg-white text-slate-900 font-bold text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
                                placeholder="0"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">NGÀY BẮT ĐẦU</label>
                            <div className="relative">
                                <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                <input 
                                    type="date" 
                                    value={editForm.startDate}
                                    onChange={(e) => setEditForm({...editForm, startDate: e.target.value})}
                                    onClick={(e) => e.currentTarget.showPicker && e.currentTarget.showPicker()}
                                    className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl bg-white text-slate-900 font-bold text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">HẠN ĐỊNH</label>
                            <div className="relative">
                                <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                <input 
                                    type="date" 
                                    value={editForm.endDate}
                                    onChange={(e) => setEditForm({...editForm, endDate: e.target.value})}
                                    onClick={(e) => e.currentTarget.showPicker && e.currentTarget.showPicker()}
                                    className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl bg-white text-slate-900 font-bold text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">MÔ TẢ</label>
                        <textarea 
                            value={editForm.description}
                            onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white text-slate-900 font-medium text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm h-24"
                            placeholder="Mô tả tóm tắt kế hoạch..."
                        ></textarea>
                    </div>

                    <div className="pt-8 flex justify-end items-center gap-8">
                        <button 
                            onClick={() => setIsEditMainInfoModalOpen(false)}
                            className="text-slate-600 hover:text-slate-800 text-sm font-bold transition-colors px-4"
                        >
                            Hủy
                        </button>
                        <button 
                            onClick={handleSaveMainInfo}
                            disabled={!editForm.accountName.trim()}
                            className="px-10 py-3 bg-blue-600 text-white font-black text-xs rounded-xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 disabled:opacity-50 flex items-center gap-2"
                        >
                            <Save size={20} /> Lưu thay đổi
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Config View Modal */}
            <Modal
                isOpen={isConfigModalOpen}
                onClose={() => setIsConfigModalOpen(false)}
                title="Sắp xếp hiển thị"
                maxWidth="max-w-2xl"
            >
                <div className="space-y-6">
                    <p className="text-sm text-slate-500">Tùy chỉnh bật/tắt và sắp xếp thứ tự hiển thị các tab và nội dung chi tiết.</p>
                    
                    <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                        {tempTabsConfig.map((tab, index) => (
                            <div 
                                key={tab.id} 
                                draggable
                                onDragStart={(e) => handleDragStart(e, index)}
                                onDragEnter={(e) => handleDragEnter(e, index)}
                                onDragEnd={handleDragEnd}
                                onDragOver={(e) => e.preventDefault()}
                                className={`border border-slate-200 rounded-xl bg-white overflow-hidden transition-all ${draggedItemIndex === index ? 'opacity-50 border-dashed border-blue-400' : ''}`}
                            >
                                <div className="flex items-center p-3 bg-slate-50 gap-3 cursor-move">
                                    <div className="text-slate-400 hover:text-slate-600">
                                        <GripVertical size={20} />
                                    </div>
                                    
                                    {/* Tab Visibility Toggle */}
                                    <button 
                                        onClick={() => toggleTabVisibility(index)}
                                        className={`w-9 h-5 rounded-full flex items-center transition-colors px-0.5 relative flex-shrink-0 ${tab.visible ? 'bg-blue-600' : 'bg-slate-300'}`}
                                        title={tab.visible ? 'Hide Tab' : 'Show Tab'}
                                    >
                                        <span className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform transform ${tab.visible ? 'translate-x-4' : 'translate-x-0'}`}></span>
                                    </button>

                                    <div className="flex-1 font-bold text-sm text-slate-700">{tab.label}</div>
                                    
                                    <div className="flex items-center gap-2">
                                        {tab.sections.length > 0 && (
                                            <button 
                                                onClick={() => toggleConfigExpand(tab.id)}
                                                className={`p-2 rounded-lg transition-colors ${expandedTabConfig[tab.id] ? 'bg-slate-200 text-slate-700' : 'hover:bg-slate-200 text-slate-500'}`}
                                            >
                                                {expandedTabConfig[tab.id] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                            </button>
                                        )}
                                    </div>
                                </div>
                                
                                {expandedTabConfig[tab.id] && tab.sections.length > 0 && (
                                    <div className="p-3 bg-white border-t border-slate-100 space-y-2">
                                        {tab.sections.map((section, sIndex) => (
                                            <div key={section.id} className="flex items-center p-2 pl-10 hover:bg-slate-50 rounded-lg transition-colors gap-3">
                                                {/* Section Visibility Toggle */}
                                                <button 
                                                    onClick={() => toggleSectionVisibility(index, sIndex)}
                                                    className={`w-9 h-5 rounded-full flex items-center transition-colors px-0.5 relative flex-shrink-0 ${section.visible ? 'bg-blue-600' : 'bg-slate-300'}`}
                                                >
                                                    <span className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform transform ${section.visible ? 'translate-x-4' : 'translate-x-0'}`}></span>
                                                </button>
                                                <span className="text-sm text-slate-600 font-medium flex-1">{section.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="pt-4 flex justify-end items-center gap-4 border-t border-slate-100">
                        <button 
                            onClick={() => setIsConfigModalOpen(false)}
                            className="text-slate-600 hover:text-slate-800 text-sm font-bold transition-colors px-4"
                        >
                            Hủy
                        </button>
                        <button 
                            onClick={handleSaveConfig}
                            className="px-8 py-2.5 bg-blue-600 text-white font-black text-xs rounded-xl hover:bg-blue-700 transition-all shadow-md active:scale-95"
                        >
                            Lưu cấu hình
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default PlanDashboard;
