import React, { useState } from 'react';
import { AccountPlan } from '../../types';
import { 
    History, 
    CheckCircle2, 
    XCircle, 
    Send, 
    Clock, 
    User, 
    AlertTriangle, 
    ShieldAlert,
    Timer
} from 'lucide-react';
import Modal from '../ui/Modal';

interface ApprovalTabProps {
    plan: AccountPlan;
    onUpdatePlan?: (fields: Partial<AccountPlan>) => void;
}

interface ApprovalLog {
    id: string;
    action: 'Submitted' | 'Approved' | 'Rejected' | 'Re-submitted' | 'Pending';
    timestamp: string;
    actor: string;
    role: string;
    comment?: string;
    isMandatoryComment?: boolean;
}

// Mock initial history data based on screenshot
const INITIAL_HISTORY: ApprovalLog[] = [
    {
        id: 'log-3',
        action: 'Pending',
        timestamp: 'Present',
        actor: 'Sarah Manager',
        role: 'Regional Director',
        comment: 'Reviewing Q3 strategic alignment...'
    },
    {
        id: 'log-2',
        action: 'Re-submitted',
        timestamp: '25/10/2023 14:30',
        actor: 'John Doe',
        role: 'Account Manager',
        comment: 'Updated revenue targets based on feedback.'
    },
    {
        id: 'log-1',
        action: 'Rejected',
        timestamp: '24/10/2023 16:45',
        actor: 'Sarah Manager',
        role: 'Regional Director',
        comment: 'Revenue projections for Q4 seem overly optimistic. Please adjust based on current pipeline coverage.',
        isMandatoryComment: true
    },
    {
        id: 'log-0',
        action: 'Submitted',
        timestamp: '24/10/2023 09:00',
        actor: 'John Doe',
        role: 'Account Manager',
        comment: 'First draft for FY2024 planning.'
    }
];

const ApprovalTab: React.FC<ApprovalTabProps> = ({ plan, onUpdatePlan }) => {
    const [history, setHistory] = useState<ApprovalLog[]>(INITIAL_HISTORY);
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [rejectReason, setRejectReason] = useState('');
    const [actionError, setActionError] = useState('');

    // Helper for visual styles
    const getActionStyle = (action: string) => {
        switch(action) {
            case 'Approved': 
                return { 
                    dotColor: 'bg-green-500', 
                    textColor: 'text-green-600',
                    commentBg: 'bg-green-50',
                    commentBorder: 'border border-green-100',
                    commentText: 'text-green-800'
                };
            case 'Rejected': 
                return { 
                    dotColor: 'bg-red-500', 
                    textColor: 'text-red-600',
                    commentBg: 'bg-red-50',
                    commentBorder: 'border border-red-100',
                    commentText: 'text-red-900'
                };
            case 'Submitted': 
            case 'Re-submitted': 
                return { 
                    dotColor: 'bg-blue-500', 
                    textColor: 'text-blue-600',
                    commentBg: 'bg-slate-50',
                    commentBorder: 'border border-slate-100',
                    commentText: 'text-slate-600'
                };
            default: // Pending
                return { 
                    dotColor: 'bg-amber-400', 
                    textColor: 'text-amber-600',
                    commentBg: 'bg-slate-50',
                    commentBorder: 'border border-slate-100',
                    commentText: 'text-slate-500'
                };
        }
    };

    // Handlers for Simulation
    const handleApprove = () => {
        const newLog: ApprovalLog = {
            id: `log-${Date.now()}`,
            action: 'Approved',
            timestamp: new Date().toLocaleString('vi-VN'),
            actor: 'Sarah Manager',
            role: 'Regional Director',
            comment: 'Plan looks solid. Good luck!'
        };
        // Remove pending state and add approved
        setHistory(prev => [newLog, ...prev.filter(p => p.action !== 'Pending')]);
        if(onUpdatePlan) onUpdatePlan({ status: 'Active' });
    };

    const handleRejectSubmit = () => {
        if (!rejectReason.trim()) {
            setActionError('Reason is mandatory for rejection.');
            return;
        }
        const newLog: ApprovalLog = {
            id: `log-${Date.now()}`,
            action: 'Rejected',
            timestamp: new Date().toLocaleString('vi-VN'),
            actor: 'Sarah Manager',
            role: 'Regional Director',
            comment: rejectReason,
            isMandatoryComment: true
        };
        setHistory(prev => [newLog, ...prev.filter(p => p.action !== 'Pending')]);
        if(onUpdatePlan) onUpdatePlan({ status: 'Needs Revision' });
        setIsRejectModalOpen(false);
        setRejectReason('');
        setActionError('');
    };

    return (
        <div className="animate-fade-in space-y-6">
            
            {/* 1. Performance Summary Card */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-100">
                            <Timer size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide">Approval Performance</h3>
                            <p className="text-xs text-slate-500 font-medium">Metric based on active time</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-5 bg-slate-50 rounded-xl border border-slate-100">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Total Duration</span>
                        <span className="text-2xl font-black text-slate-800">2.5 Days</span>
                    </div>
                    <div className="p-5 bg-orange-50 rounded-xl border border-orange-100">
                        <span className="text-[10px] font-black text-orange-400 uppercase tracking-widest block mb-1">Revision Wait</span>
                        <span className="text-2xl font-black text-orange-600">0.8 Days</span>
                    </div>
                    <div className="p-5 bg-green-50 rounded-xl border border-green-100 relative overflow-hidden">
                        <span className="text-[10px] font-black text-green-600 uppercase tracking-widest block mb-1">Actual Approval Time</span>
                        <span className="text-2xl font-black text-green-700">1.7 Days</span>
                    </div>
                </div>
            </div>

            {/* 2. Timeline History */}
            <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shadow-sm border border-blue-100">
                        <History size={20} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800">Approval Timeline</h3>
                </div>

                <div className="relative pl-2">
                    {/* Vertical Line */}
                    <div className="absolute left-[19px] top-3 bottom-8 w-0.5 bg-slate-200 border-l border-dashed border-slate-300"></div>

                    <div className="space-y-8">
                        {history.map((log, index) => {
                            const { dotColor, textColor, commentBg, commentBorder, commentText } = getActionStyle(log.action);
                            const isLast = index === history.length - 1;
                            
                            return (
                                <div key={log.id} className="relative pl-12 group">
                                    {/* Timeline Dot */}
                                    <div className={`absolute left-[13px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm z-10 ${dotColor} ring-4 ring-white`}></div>

                                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
                                        {/* Left Content: Action & User */}
                                        <div className="lg:col-span-4">
                                            <div className="flex items-center gap-3 mb-1.5">
                                                <span className={`text-sm font-black uppercase tracking-wide ${textColor}`}>
                                                    {log.action}
                                                </span>
                                                <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                                                    {log.timestamp}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                                <User size={14} className="text-slate-400" />
                                                <span className="font-bold text-slate-700">{log.actor}</span>
                                                <span className="text-slate-400">• {log.role}</span>
                                            </div>
                                        </div>

                                        {/* Right Content: Comment Block */}
                                        <div className="lg:col-span-8">
                                            {log.comment && (
                                                <div className={`p-4 rounded-xl text-sm font-medium leading-relaxed shadow-sm ${commentBg} ${commentBorder} ${commentText}`}>
                                                    {log.isMandatoryComment && (
                                                        <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-red-500 mb-2">
                                                            <ShieldAlert size={12} /> Reason for Rejection
                                                        </div>
                                                    )}
                                                    "{log.comment}"
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Rejection Modal */}
            <Modal
                isOpen={isRejectModalOpen}
                onClose={() => { setIsRejectModalOpen(false); setActionError(''); }}
                title="Reject Plan"
                maxWidth="max-w-md"
            >
                <div className="space-y-4">
                    <div className="bg-red-50 p-4 rounded-xl border border-red-100 flex gap-3">
                        <AlertTriangle className="text-red-500 shrink-0" size={20} />
                        <div>
                            <h4 className="text-sm font-bold text-red-700">Action Required</h4>
                            <p className="text-xs text-red-600 mt-1">Please provide a reason for rejecting this plan. This comment will be logged in the history.</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Reason (Mandatory)</label>
                        <textarea 
                            value={rejectReason}
                            onChange={(e) => { setRejectReason(e.target.value); setActionError(''); }}
                            className={`w-full p-3 border rounded-xl outline-none text-sm min-h-[100px] focus:ring-2 ${actionError ? 'border-red-300 focus:ring-red-200' : 'border-slate-200 focus:ring-blue-100 focus:border-blue-400'}`}
                            placeholder="Enter detailed feedback for the Account Manager..."
                        />
                        {actionError && <p className="text-xs text-red-500 font-bold flex items-center gap-1"><AlertTriangle size={12} /> {actionError}</p>}
                    </div>

                    <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                        <button 
                            onClick={() => setIsRejectModalOpen(false)}
                            className="px-4 py-2 text-slate-500 font-bold text-sm hover:bg-slate-50 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleRejectSubmit}
                            className="px-6 py-2 bg-red-600 text-white font-bold text-sm rounded-lg hover:bg-red-700 shadow-md transition-all active:scale-95"
                        >
                            Confirm Rejection
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default ApprovalTab;