
import React, { useState } from 'react';
import { ChevronLeft, Share2, Download, MoreHorizontal, Edit2, Calendar, Save, X } from 'lucide-react';
import { AccountPlan, PlanTab } from '../types';
import OverviewTab from './dashboard/OverviewTab';
import MarketTab from './dashboard/MarketTab';
import StrategyTab from './dashboard/StrategyTab';
import ExecutionTab from './dashboard/ExecutionTab';
import ApprovalTab from './dashboard/ApprovalTab';
import WhitespaceTab from './dashboard/WhitespaceTab';
import ExportModal from './ExportModal';
import Modal from './ui/Modal';

interface PlanDashboardProps {
    plan: AccountPlan;
    onBack: () => void;
    onUpdatePlan: (fields: Partial<AccountPlan>) => void;
}

const PlanDashboard: React.FC<PlanDashboardProps> = ({ plan, onBack, onUpdatePlan }) => {
    const [activeTab, setActiveTab] = useState<PlanTab>(PlanTab.OVERVIEW);
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    const [isEditMainInfoModalOpen, setIsEditMainInfoModalOpen] = useState(false);

    // Form state for main info
    const [editForm, setEditForm] = useState({
        accountName: plan.accountName,
        startDate: plan.startDate || '',
        endDate: plan.endDate || ''
    });

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
        onUpdatePlan(editForm);
        setIsEditMainInfoModalOpen(false);
    };

    const openEditModal = () => {
        setEditForm({
            accountName: plan.accountName,
            startDate: plan.startDate || '',
            endDate: plan.endDate || ''
        });
        setIsEditMainInfoModalOpen(true);
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
                        <button className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors" title="Share">
                            <Share2 size={20} />
                        </button>
                        <button className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
                            <MoreHorizontal size={20} />
                        </button>
                    </div>
                </div>

                <div className="flex gap-6 border-b border-slate-200 overflow-x-auto">
                    {[
                        { id: PlanTab.OVERVIEW, label: 'Overview & Performance' },
                        { id: PlanTab.STAKEHOLDERS, label: 'Stakeholder Map' },
                        { id: PlanTab.ANALYSIS, label: 'Strategic Analysis' },
                        { id: PlanTab.WHITESPACE, label: 'White Space Analysis' },
                        { id: PlanTab.ACTION_PLAN, label: 'Action Plan & Tracking' },
                        { id: PlanTab.APPROVAL, label: 'Approval & Budget' },
                    ].map((tab) => (
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
                {activeTab === PlanTab.OVERVIEW && <OverviewTab plan={plan} onUpdatePlan={onUpdatePlan} />}
                {activeTab === PlanTab.ANALYSIS && <MarketTab plan={plan} />}
                {activeTab === PlanTab.WHITESPACE && <WhitespaceTab plan={plan} />}
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
                title="Chỉnh sửa thông tin kế hoạch"
                maxWidth="max-w-md"
            >
                <div className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Tên kế hoạch <span className="text-red-500">*</span></label>
                        <input 
                            type="text" 
                            value={editForm.accountName}
                            onChange={(e) => setEditForm({...editForm, accountName: e.target.value})}
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                            placeholder="Nhập tên kế hoạch..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Ngày bắt đầu</label>
                            <div className="relative">
                                <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                <input 
                                    type="date" 
                                    value={editForm.startDate}
                                    onChange={(e) => setEditForm({...editForm, startDate: e.target.value})}
                                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Ngày kết thúc</label>
                            <div className="relative">
                                <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                <input 
                                    type="date" 
                                    value={editForm.endDate}
                                    onChange={(e) => setEditForm({...editForm, endDate: e.target.value})}
                                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                        <button 
                            onClick={() => setIsEditMainInfoModalOpen(false)}
                            className="px-5 py-2 text-slate-600 font-bold text-sm hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            Hủy
                        </button>
                        <button 
                            onClick={handleSaveMainInfo}
                            disabled={!editForm.accountName.trim()}
                            className="px-8 py-2 bg-blue-600 text-white font-bold text-sm rounded-lg hover:bg-blue-700 transition-all shadow-md shadow-blue-100 disabled:opacity-50 flex items-center gap-2"
                        >
                            <Save size={16} /> Lưu thay đổi
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default PlanDashboard;
