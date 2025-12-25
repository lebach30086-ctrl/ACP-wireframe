
import React, { useState } from 'react';
import { AccountPlan } from '../../types';
import { 
    DollarSign, 
    CheckCircle2, 
    Clock, 
    MessageSquare, 
    Send, 
    Check, 
    X, 
    AlertCircle, 
    ArrowRight,
    ClipboardCheck,
    History,
    Edit2,
    Save
} from 'lucide-react';
import Modal from '../ui/Modal';

interface ApprovalTabProps {
    plan: AccountPlan;
    onUpdatePlan?: (fields: Partial<AccountPlan>) => void;
}

interface BudgetData {
    te: number;
    marketing: number;
    gifts: number;
}

const ApprovalTab: React.FC<ApprovalTabProps> = ({ plan, onUpdatePlan }) => {
    const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Budget State
    const [isEditingBudget, setIsEditingBudget] = useState(false);
    const [budget, setBudget] = useState<BudgetData>({
        te: 12000,
        marketing: 25000,
        gifts: 8000
    });
    const [tempBudget, setTempBudget] = useState<BudgetData>({ ...budget });

    const totalRequested = budget.te + budget.marketing + budget.gifts;
    const tempTotalRequested = tempBudget.te + tempBudget.marketing + tempBudget.gifts;

    const handleStatusChange = (newStatus: AccountPlan['status'], extraFields: Partial<AccountPlan> = {}) => {
        if (onUpdatePlan) {
            onUpdatePlan({ status: newStatus, ...extraFields });
        }
    };

    const handleSubmit = () => {
        setIsSubmitting(true);
        setTimeout(() => {
            handleStatusChange('Pending Approval', { 
                submittedDate: new Date().toLocaleDateString('vi-VN') 
            });
            setIsSubmitting(false);
        }, 1000);
    };

    const handleApprove = () => {
        handleStatusChange('Active', { 
            approvedDate: new Date().toLocaleDateString('vi-VN') 
        });
    };

    const handleReject = () => {
        if (!rejectionReason.trim()) return;
        handleStatusChange('Needs Revision', { 
            rejectionReason: rejectionReason 
        });
        setIsRejectionModalOpen(false);
        setRejectionReason('');
    };

    const handleSaveBudget = () => {
        setBudget({ ...tempBudget });
        setIsEditingBudget(false);
    };

    const handleCancelBudget = () => {
        setTempBudget({ ...budget });
        setIsEditingBudget(false);
    };

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
            {/* Left Column: Workflow Status & Actions */}
            <div className="lg:col-span-8 space-y-6">
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                     <div className="flex justify-between items-center mb-8">
                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <CheckCircle2 size={20} className="text-blue-600" />
                            Approval Workflow
                        </h3>
                        {plan.status === 'Draft' || plan.status === 'Needs Revision' ? (
                            <button 
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold shadow-md transition-all active:scale-95 disabled:opacity-50"
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit for Approval'} <ArrowRight size={16} />
                            </button>
                        ) : null}
                    </div>

                    {/* Progress Indicator Steps */}
                    <div className="relative pl-6 border-l-2 border-slate-200 space-y-12">
                        {/* Step 1: Draft / Needs Revision */}
                        <div className="relative">
                            <div className={`absolute -left-[31px] top-0 w-6 h-6 rounded-full border-4 border-white flex items-center justify-center text-white
                                ${plan.status === 'Draft' || plan.status === 'Needs Revision' ? 'bg-blue-500 animate-pulse' : 'bg-green-500'}
                            `}>
                                {plan.status === 'Draft' || plan.status === 'Needs Revision' ? <div className="w-2 h-2 bg-white rounded-full"></div> : <Check size={12} strokeWidth={4} />}
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800 text-sm">Step 1: Preparation (AM)</h4>
                                <p className="text-xs text-slate-500 mt-1">
                                    {plan.status === 'Draft' ? 'Kế hoạch đang được soạn thảo.' : plan.status === 'Needs Revision' ? 'Kế hoạch cần được chỉnh sửa theo yêu cầu.' : 'Kế hoạch đã hoàn thành và gửi đi.'}
                                </p>
                                {plan.status === 'Needs Revision' && plan.rejectionReason && (
                                    <div className="mt-3 p-3 bg-red-50 border border-red-100 rounded-lg">
                                        <div className="flex items-center gap-2 text-red-700 text-xs font-bold mb-1 uppercase tracking-wider">
                                            <AlertCircle size={14} /> Rejection Reason
                                        </div>
                                        <p className="text-sm text-red-800 italic">"{plan.rejectionReason}"</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Step 2: Pending Approval (Regional Manager) */}
                        <div className="relative">
                            <div className={`absolute -left-[31px] top-0 w-6 h-6 rounded-full border-4 border-white flex items-center justify-center text-white
                                ${plan.status === 'Pending Approval' ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 
                                  (plan.status === 'Active' || plan.status === 'Completed') ? 'bg-green-500' : 'bg-slate-200'}
                            `}>
                                {plan.status === 'Pending Approval' ? <Clock size={12} /> : 
                                 (plan.status === 'Active' || plan.status === 'Completed') ? <Check size={12} strokeWidth={4} /> : null}
                            </div>
                            <div className={plan.status === 'Draft' || plan.status === 'Needs Revision' ? 'opacity-40' : ''}>
                                <h4 className="font-bold text-slate-800 text-sm">Step 2: Managerial Review</h4>
                                <p className="text-xs text-slate-500 mt-1">
                                    {plan.status === 'Pending Approval' ? 'Đang chờ Quản lý trực tiếp phê duyệt.' : plan.approvedDate ? `Phê duyệt bởi Sarah Manager vào ${plan.approvedDate}` : 'Chờ AM gửi phê duyệt.'}
                                </p>
                                
                                {plan.status === 'Pending Approval' && (
                                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl shadow-sm animate-in fade-in slide-in-from-left-2 duration-300">
                                        <h5 className="text-sm font-bold text-blue-900 mb-3 flex items-center gap-2">
                                            <ClipboardCheck size={16} /> Manager Action Required
                                        </h5>
                                        <div className="flex gap-3">
                                            <button 
                                                onClick={handleApprove}
                                                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-lg flex items-center gap-2 shadow-sm shadow-green-100"
                                            >
                                                <Check size={16} /> Approve Plan
                                            </button>
                                            <button 
                                                onClick={() => setIsRejectionModalOpen(true)}
                                                className="px-6 py-2 bg-white border border-red-200 text-red-600 hover:bg-red-50 text-sm font-bold rounded-lg flex items-center gap-2"
                                            >
                                                <X size={16} /> Needs Revision
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Step 3: Deployment (Active) */}
                        <div className="relative">
                            <div className={`absolute -left-[31px] top-0 w-6 h-6 rounded-full border-4 border-white flex items-center justify-center text-white
                                ${plan.status === 'Active' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-slate-200'}
                            `}>
                                {plan.status === 'Active' ? <Check size={12} strokeWidth={4} /> : null}
                            </div>
                            <div className={plan.status !== 'Active' && plan.status !== 'Completed' ? 'opacity-40' : ''}>
                                <h4 className="font-bold text-slate-800 text-sm">Step 3: Execution & Monitoring</h4>
                                <p className="text-xs text-slate-500 mt-1">Kế hoạch đã được phê duyệt và đang thực thi.</p>
                            </div>
                        </div>

                        {/* Step 4: Final Sign-off (Completed) */}
                        <div className="relative">
                            <div className={`absolute -left-[31px] top-0 w-6 h-6 rounded-full border-4 border-white flex items-center justify-center text-white
                                ${plan.status === 'Completed' ? 'bg-slate-800' : 'bg-slate-200'}
                            `}>
                                {plan.status === 'Completed' ? <Check size={12} strokeWidth={4} /> : null}
                            </div>
                            <div className={plan.status !== 'Completed' ? 'opacity-40' : ''}>
                                <h4 className="font-bold text-slate-800 text-sm">Step 4: Archived</h4>
                                <p className="text-xs text-slate-500 mt-1">Chu kỳ kế hoạch đã kết thúc và được lưu trữ.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Audit Trail / History */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                    <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <History size={16} className="text-slate-400" />
                        Approval History
                    </h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center text-xs">
                             <div className="flex gap-3 items-center">
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold">JD</div>
                                <div>
                                    <p className="font-bold text-slate-800">John Doe (AM)</p>
                                    <p className="text-slate-500">Kế hoạch được tạo bản nháp đầu tiên.</p>
                                </div>
                             </div>
                             <span className="text-slate-400">24/10/2023 09:00</span>
                        </div>
                        {plan.submittedDate && (
                            <div className="flex justify-between items-center text-xs">
                                <div className="flex gap-3 items-center">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold">JD</div>
                                    <div>
                                        <p className="font-bold text-slate-800">John Doe (AM)</p>
                                        <p className="text-slate-500">Gửi yêu cầu phê duyệt kế hoạch.</p>
                                    </div>
                                </div>
                                <span className="text-slate-400">{plan.submittedDate}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Right Column: Financials & Discussions */}
            <div className="lg:col-span-4 space-y-6">
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 group">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <DollarSign size={20} className="text-green-600" />
                            Budget Summary
                        </h3>
                        {!isEditingBudget ? (
                            <button 
                                onClick={() => setIsEditingBudget(true)}
                                className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                            >
                                <Edit2 size={16} />
                            </button>
                        ) : (
                            <div className="flex gap-1 animate-in fade-in slide-in-from-right-2">
                                <button 
                                    onClick={handleCancelBudget}
                                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                >
                                    <X size={16} />
                                </button>
                                <button 
                                    onClick={handleSaveBudget}
                                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                >
                                    <Save size={16} />
                                </button>
                            </div>
                        )}
                    </div>
                    
                    <div className="space-y-4">
                        <div className="p-4 bg-slate-50 border border-slate-100 rounded-lg transition-all">
                            <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Total Requested</span>
                            <div className="text-2xl font-black text-slate-800 mt-1">
                                {formatCurrency(isEditingBudget ? tempTotalRequested : totalRequested)}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <BudgetItem 
                                label="T&E" 
                                value={isEditingBudget ? tempBudget.te : budget.te} 
                                isEditing={isEditingBudget}
                                onChange={(val) => setTempBudget({ ...tempBudget, te: val })}
                            />
                            <BudgetItem 
                                label="Marketing" 
                                value={isEditingBudget ? tempBudget.marketing : budget.marketing} 
                                isEditing={isEditingBudget}
                                onChange={(val) => setTempBudget({ ...tempBudget, marketing: val })}
                            />
                            <BudgetItem 
                                label="Gifts" 
                                value={isEditingBudget ? tempBudget.gifts : budget.gifts} 
                                isEditing={isEditingBudget}
                                onChange={(val) => setTempBudget({ ...tempBudget, gifts: val })}
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col h-[400px]">
                     <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <MessageSquare size={20} className="text-blue-600" />
                        Review Feedback
                    </h3>
                    <div className="flex-1 space-y-4 mb-4 overflow-y-auto custom-scrollbar pr-1">
                        <div className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600 shrink-0">
                                SM
                            </div>
                            <div className="bg-slate-50 p-3 rounded-r-lg rounded-bl-lg">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-xs font-bold text-slate-700">Sarah Manager</span>
                                    <span className="text-[10px] text-slate-400">2h ago</span>
                                </div>
                                <p className="text-xs text-slate-600 leading-relaxed">Please clarify the ROI on the marketing event spend. Seems high for Q2.</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="relative">
                        <input 
                            type="text" 
                            className="w-full pl-4 pr-10 py-2.5 rounded-lg border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Type a message..."
                        />
                        <button className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-600 hover:bg-blue-50 p-1.5 rounded-full transition-colors">
                            <Send size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Rejection Reason Modal */}
            <Modal
                isOpen={isRejectionModalOpen}
                onClose={() => setIsRejectionModalOpen(false)}
                title="Yêu cầu chỉnh sửa (Rejection)"
                maxWidth="max-w-md"
            >
                <div className="space-y-4">
                    <div className="p-3 bg-red-50 text-red-700 text-xs font-medium rounded-lg flex gap-2">
                        <AlertCircle size={16} className="shrink-0" />
                        Vui lòng nhập lý do cụ thể để AM có cơ sở chỉnh sửa lại kế hoạch này.
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Lý do từ chối phê duyệt <span className="text-red-500">*</span></label>
                        <textarea 
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            className="w-full p-4 border border-slate-200 rounded-xl bg-white text-sm outline-none focus:ring-2 focus:ring-red-500 min-h-[120px]"
                            placeholder="Ví dụ: Cần bổ sung phân tích chi tiết về ROI cho mục Marketing Events..."
                        />
                    </div>
                    <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                        <button 
                            onClick={() => setIsRejectionModalOpen(false)}
                            className="px-4 py-2 text-slate-600 font-bold text-sm hover:bg-slate-100 rounded-lg"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleReject}
                            disabled={!rejectionReason.trim()}
                            className="px-6 py-2 bg-red-600 text-white font-bold text-sm rounded-lg hover:bg-red-700 disabled:opacity-50"
                        >
                            Confirm Rejection
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

const BudgetItem: React.FC<{ 
    label: string; 
    value: number; 
    isEditing: boolean; 
    onChange: (val: number) => void 
}> = ({ label, value, isEditing, onChange }) => (
    <div className="flex justify-between items-center text-sm border-b border-slate-50 pb-2 last:border-0">
        <span className="text-slate-600 font-medium">{label}</span>
        {isEditing ? (
            <div className="relative">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs">$</span>
                <input 
                    type="number" 
                    value={value} 
                    onChange={(e) => onChange(Number(e.target.value))}
                    className="w-24 pl-5 pr-2 py-1 rounded border border-blue-200 bg-white text-right text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
        ) : (
            <span className="font-bold text-slate-800">
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value)}
            </span>
        )}
    </div>
);

export default ApprovalTab;
