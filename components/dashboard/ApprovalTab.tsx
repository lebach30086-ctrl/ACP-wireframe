import React from 'react';
import { AccountPlan } from '../../types';
import { DollarSign, CheckCircle2, Clock, MessageSquare, Send, Check, X } from 'lucide-react';

interface ApprovalTabProps {
    plan: AccountPlan;
}

const ApprovalTab: React.FC<ApprovalTabProps> = ({ plan }) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
            {/* 1.8.1 Budget Request */}
            <div className="lg:col-span-4 space-y-6">
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <DollarSign size={20} className="text-green-600" />
                        Budget Request
                    </h3>
                    
                    <div className="space-y-4">
                        <div className="p-4 bg-slate-50 border border-slate-100 rounded-lg">
                            <span className="text-xs text-slate-500 uppercase font-semibold">Total Requested</span>
                            <div className="text-2xl font-bold text-slate-800 mt-1">$45,000</div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-600">Travel & Expenses</span>
                                <span className="font-medium">$12,000</span>
                            </div>
                            <div className="h-px bg-slate-100"></div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-600">Marketing Events</span>
                                <span className="font-medium">$25,000</span>
                            </div>
                            <div className="h-px bg-slate-100"></div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-600">Client Gifts</span>
                                <span className="font-medium">$8,000</span>
                            </div>
                        </div>

                        <button className="w-full py-2 bg-white border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors text-sm">
                            Edit Budget
                        </button>
                    </div>
                </div>

                {/* 1.8.3 Manager Comments */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex-1 flex flex-col">
                     <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <MessageSquare size={20} className="text-blue-600" />
                        Feedback
                    </h3>
                    <div className="flex-1 space-y-4 mb-4 max-h-[300px] overflow-y-auto">
                        <div className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600 shrink-0">
                                SM
                            </div>
                            <div className="bg-slate-50 p-3 rounded-r-lg rounded-bl-lg">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-xs font-bold text-slate-700">Sarah Manager</span>
                                    <span className="text-[10px] text-slate-400">2h ago</span>
                                </div>
                                <p className="text-sm text-slate-600">Please clarify the ROI on the marketing event spend. Seems high for Q2.</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="relative">
                        <input 
                            type="text" 
                            className="w-full pl-4 pr-10 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                            placeholder="Write a reply..."
                        />
                        <button className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-600 hover:bg-blue-50 p-1.5 rounded-full">
                            <Send size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* 1.8.2 Approval Workflow */}
            <div className="lg:col-span-8">
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 h-full">
                     <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <CheckCircle2 size={20} className="text-purple-600" />
                        Approval Workflow
                    </h3>

                    <div className="relative pl-6 border-l-2 border-slate-200 space-y-10">
                        {/* Step 1 */}
                        <div className="relative">
                            <div className="absolute -left-[31px] top-0 w-6 h-6 rounded-full bg-green-500 border-4 border-white flex items-center justify-center text-white">
                                <Check size={12} strokeWidth={4} />
                            </div>
                            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h4 className="font-bold text-slate-800 text-sm">Account Owner Submit</h4>
                                        <p className="text-xs text-slate-500">Submitted by John Doe on Oct 24, 2023</p>
                                    </div>
                                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded">Completed</span>
                                </div>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="relative">
                            <div className="absolute -left-[31px] top-0 w-6 h-6 rounded-full bg-blue-500 border-4 border-white flex items-center justify-center text-white shadow-sm ring-4 ring-blue-50">
                                <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                            </div>
                            <div className="bg-white p-4 rounded-lg border border-blue-200 shadow-sm">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h4 className="font-bold text-slate-800 text-sm">Sales Manager Review</h4>
                                        <p className="text-xs text-slate-500">Pending review by Sarah Smith</p>
                                    </div>
                                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded flex items-center gap-1">
                                        <Clock size={12} /> In Progress
                                    </span>
                                </div>
                                <div className="flex gap-3 mt-4">
                                    <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg flex items-center gap-2">
                                        <Check size={16} /> Approve
                                    </button>
                                    <button className="px-4 py-2 bg-white border border-red-200 text-red-600 hover:bg-red-50 text-sm font-medium rounded-lg flex items-center gap-2">
                                        <X size={16} /> Reject
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="relative">
                            <div className="absolute -left-[31px] top-0 w-6 h-6 rounded-full bg-slate-200 border-4 border-white"></div>
                            <div className="opacity-60">
                                <h4 className="font-bold text-slate-800 text-sm">Finance Approval</h4>
                                <p className="text-xs text-slate-500">Waiting for previous step</p>
                            </div>
                        </div>
                         {/* Step 4 */}
                         <div className="relative">
                            <div className="absolute -left-[31px] top-0 w-6 h-6 rounded-full bg-slate-200 border-4 border-white"></div>
                            <div className="opacity-60">
                                <h4 className="font-bold text-slate-800 text-sm">VP Final Sign-off</h4>
                                <p className="text-xs text-slate-500">Waiting for previous step</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApprovalTab;