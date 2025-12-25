
import React from 'react';
import { AccountPlan } from '../../types';
import { 
    History
} from 'lucide-react';

interface ApprovalTabProps {
    plan: AccountPlan;
    onUpdatePlan?: (fields: Partial<AccountPlan>) => void;
}

const ApprovalTab: React.FC<ApprovalTabProps> = ({ plan }) => {
    return (
        <div className="animate-fade-in p-6 bg-slate-50/50 rounded-2xl border border-slate-100">
            {/* Approval History Card */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
                <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shadow-sm border border-blue-100">
                        <History size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">Approval History</h3>
                </div>

                <div className="space-y-8">
                    {/* Activity Item */}
                    <div className="flex justify-between items-center group">
                         <div className="flex gap-4 items-center">
                            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-sm font-bold text-slate-500 border border-slate-200 shadow-sm">
                                JD
                            </div>
                            <div className="flex flex-col">
                                <p className="font-bold text-slate-900 text-base">John Doe (AM)</p>
                                <p className="text-slate-500 text-sm">Kế hoạch được tạo bản nháp đầu tiên.</p>
                            </div>
                         </div>
                         <div className="bg-slate-100 px-4 py-1.5 rounded-lg border border-slate-200">
                             <span className="text-xs font-bold text-slate-500 uppercase tracking-tight">
                                 24/10/2023 09:00
                             </span>
                         </div>
                    </div>

                    {/* Conditional Submitted Activity */}
                    {plan.submittedDate && (
                        <div className="flex justify-between items-center group">
                            <div className="flex gap-4 items-center">
                                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-sm font-bold text-blue-600 border border-blue-100 shadow-sm">
                                    JD
                                </div>
                                <div className="flex flex-col">
                                    <p className="font-bold text-slate-900 text-base">John Doe (AM)</p>
                                    <p className="text-slate-500 text-sm">Gửi yêu cầu phê duyệt kế hoạch.</p>
                                </div>
                            </div>
                            <div className="bg-slate-100 px-4 py-1.5 rounded-lg border border-slate-200">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-tight">
                                    {plan.submittedDate}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Dashed placeholder for future activities as shown in screenshot */}
                    <div className="mt-6 border-2 border-dashed border-slate-50 rounded-2xl py-24 flex items-center justify-center">
                        <p className="text-slate-300 font-bold text-sm tracking-wide">
                            Chưa có thêm hoạt động phê duyệt nào.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApprovalTab;
