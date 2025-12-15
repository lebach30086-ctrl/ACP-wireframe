import React from 'react';
import { Download, PieChart, Info, ThumbsUp, ThumbsDown, MessageSquare, BarChart3, Plus, Edit2 } from 'lucide-react';
import { AccountPlan } from '../../types';

interface MarketTabProps {
    plan: AccountPlan;
}

const MarketTab: React.FC<MarketTabProps> = ({ plan }) => {
    const isNew = plan.isNew;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
            {/* Industry Analysis */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col h-full relative group">
                <button className={`absolute top-6 right-6 p-1.5 rounded transition-colors opacity-0 group-hover:opacity-100 ${isNew ? 'bg-blue-600 text-white opacity-100 shadow-sm' : 'text-slate-400 hover:bg-slate-50 hover:text-blue-600'}`}>
                    {isNew ? <Plus size={16} /> : <Edit2 size={16} />}
                </button>

                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">Industry Analysis</h3>
                        <p className="text-sm text-slate-500">{isNew ? 'No industry data' : 'Manufacturing & Supply Chain'}</p>
                    </div>
                    {!isNew && (
                        <button className="flex items-center gap-2 text-sm text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors font-medium mr-8">
                            <Download size={16} /> Import Data
                        </button>
                    )}
                </div>

                {isNew ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-400 min-h-[250px] border-2 border-dashed border-slate-100 rounded-xl">
                        <div className="bg-slate-50 p-4 rounded-full mb-3">
                            <BarChart3 size={32} />
                        </div>
                        <p className="text-sm font-medium mb-1">Industry data is missing</p>
                        <p className="text-xs text-slate-400 mb-4 max-w-xs text-center">Add market insights to compare performance against industry benchmarks.</p>
                        <button className="text-blue-600 text-sm font-medium hover:underline">Add Industry Metrics</button>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-2 gap-4 mb-6">
                             <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                                <div className="text-xs text-slate-500 font-medium uppercase mb-1">Avg Margin</div>
                                <div className="text-2xl font-bold text-slate-800">12.5%</div>
                             </div>
                             <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                                <div className="text-xs text-slate-500 font-medium uppercase mb-1">YOY Growth</div>
                                <div className="text-2xl font-bold text-green-600">+4.2%</div>
                             </div>
                        </div>

                        <div className="space-y-4">
                            <h4 className="font-semibold text-slate-700 text-sm">Key Trends</h4>
                            <ul className="space-y-2 text-sm text-slate-600 list-disc list-inside">
                                <li>Shift towards AI-driven inventory management.</li>
                                <li>Increased focus on sustainable manufacturing processes.</li>
                                <li>Consolidation of smaller logistics providers.</li>
                            </ul>
                        </div>
                    </>
                )}
            </div>

            {/* Relationship Health */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col h-full relative group">
                <button className={`absolute top-6 right-6 p-1.5 rounded transition-colors opacity-0 group-hover:opacity-100 ${isNew ? 'bg-blue-600 text-white opacity-100 shadow-sm' : 'text-slate-400 hover:bg-slate-50 hover:text-blue-600'}`}>
                    {isNew ? <Plus size={16} /> : <Edit2 size={16} />}
                </button>
                
                 <div className="mb-6">
                    <h3 className="text-lg font-bold text-slate-800">Relationship Health</h3>
                    <p className="text-sm text-slate-500">Qualitative & Quantitative Assessment</p>
                </div>

                {isNew ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-400 min-h-[250px] border-2 border-dashed border-slate-100 rounded-xl">
                        <div className="bg-slate-50 p-4 rounded-full mb-3">
                            <PieChart size={32} />
                        </div>
                        <p className="text-sm font-medium mb-4">No health assessment</p>
                        <button className="text-blue-600 text-sm font-medium hover:underline">Start Assessment</button>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center gap-8 mb-8">
                            {/* Fake Gauge */}
                            <div className="relative w-32 h-16 bg-slate-100 rounded-t-full overflow-hidden flex justify-center">
                                <div className="absolute bottom-0 w-28 h-14 bg-white rounded-t-full flex items-end justify-center z-10">
                                    <span className="text-2xl font-bold text-slate-800 mb-1">72</span>
                                </div>
                                 <div className="w-full h-full bg-gradient-to-r from-red-400 via-yellow-400 to-green-500" style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0, 0 0)' }}></div>
                                 <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-16 bg-slate-800 origin-bottom transform rotate-45 z-20" style={{ transform: 'rotate(45deg) translateX(-50%)' }}></div>
                            </div>
                            <div>
                                <div className="text-sm font-bold text-slate-700">NPS Score: 72 (Promoter)</div>
                                <div className="text-xs text-slate-500">Last survey: 2 months ago</div>
                            </div>
                        </div>

                        {/* Purchase History Summary */}
                        <div className="space-y-4 mb-6">
                            <h4 className="font-semibold text-slate-700 text-sm">Product Penetration</h4>
                            <div className="flex gap-2">
                                <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold border border-green-200">Core Platform</span>
                                <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold border border-green-200">Analytics</span>
                                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-xs font-semibold border border-slate-200 dashed opacity-70">AI Add-on</span>
                            </div>
                        </div>

                        {/* Qualitative Note */}
                         <div className="mt-auto">
                            <label className="text-xs font-semibold uppercase text-slate-500 mb-2 block">Relationship Sentiment</label>
                            <div className="p-3 bg-yellow-50 text-yellow-800 text-sm rounded-lg border border-yellow-200 italic flex gap-3">
                                <MessageSquare size={16} className="shrink-0 mt-0.5" />
                                "Strong operational ties, but weak connection with C-Suite. Need to elevate the conversation before renewal."
                            </div>
                         </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default MarketTab;