import React, { useState } from 'react';
import { ChevronLeft, Share2, Printer, MoreHorizontal } from 'lucide-react';
import { AccountPlan, PlanTab } from '../types';
import OverviewTab from './dashboard/OverviewTab';
import MarketTab from './dashboard/MarketTab';
import StrategyTab from './dashboard/StrategyTab';
import ExecutionTab from './dashboard/ExecutionTab';

interface PlanDashboardProps {
    plan: AccountPlan;
    onBack: () => void;
    onUpdatePlan: (fields: Partial<AccountPlan>) => void;
}

const PlanDashboard: React.FC<PlanDashboardProps> = ({ plan, onBack, onUpdatePlan }) => {
    const [activeTab, setActiveTab] = useState<PlanTab>(PlanTab.OVERVIEW);

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'Active': return 'bg-green-100 text-green-700 border-green-200';
            case 'Draft': return 'bg-slate-100 text-slate-700 border-slate-200';
            case 'Review': return 'bg-orange-100 text-orange-700 border-orange-200';
            case 'Completed': return 'bg-blue-100 text-blue-700 border-blue-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header Navigation Area */}
            <div className="flex flex-col space-y-4">
                <button 
                    onClick={onBack}
                    className="flex items-center gap-1 text-sm text-slate-500 hover:text-blue-600 transition-colors w-fit"
                >
                    <ChevronLeft size={16} /> Back to List
                </button>
                
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-200 pb-4">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-3xl font-bold text-slate-900">{plan.accountName}</h1>
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border uppercase tracking-wide ${getStatusStyles(plan.status)}`}>
                                {plan.status}
                            </span>
                        </div>
                        <p className="text-slate-500 flex items-center gap-2">
                            <span>{plan.fiscalYear} Account Plan</span>
                            <span className="w-1 h-1 bg-slate-400 rounded-full"></span>
                            <span>Owned by {plan.owner}</span>
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <button className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors" title="Print">
                            <Printer size={20} />
                        </button>
                        <button className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors" title="Share">
                            <Share2 size={20} />
                        </button>
                        <button className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
                            <MoreHorizontal size={20} />
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-6 border-b border-slate-200">
                    {[
                        { id: PlanTab.OVERVIEW, label: 'Overview & Performance' },
                        { id: PlanTab.MARKET, label: 'Market & Insights' },
                        { id: PlanTab.STRATEGY, label: 'Strategy & People' },
                        { id: PlanTab.EXECUTION, label: 'Execution & Goals' },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`pb-3 text-sm font-medium transition-all relative
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

            {/* Tab Content */}
            <div className="min-h-[500px]">
                {activeTab === PlanTab.OVERVIEW && <OverviewTab plan={plan} onUpdatePlan={onUpdatePlan} />}
                {activeTab === PlanTab.MARKET && <MarketTab plan={plan} />}
                {activeTab === PlanTab.STRATEGY && <StrategyTab plan={plan} />}
                {activeTab === PlanTab.EXECUTION && <ExecutionTab plan={plan} />}
            </div>
        </div>
    );
};

export default PlanDashboard;