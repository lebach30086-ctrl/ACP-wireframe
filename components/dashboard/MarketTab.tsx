import React from 'react';
import { Download, BarChart3, Plus, Edit2, AlertTriangle, TrendingUp, Search, Swords, ExternalLink } from 'lucide-react';
import { AccountPlan } from '../../types';

interface MarketTabProps {
    plan: AccountPlan;
}

interface Competitor {
    name: string;
    website: string;
    threatLevel: 'High' | 'Medium' | 'Low';
    strengths: string;
    weaknesses: string;
}

const MOCK_COMPETITORS: Competitor[] = [
    {
        name: 'TechGiant Solutions',
        website: 'https://example.com',
        threatLevel: 'High',
        strengths: 'Extensive global infrastructure, deep pockets for R&D.',
        weaknesses: 'Slow customer support, legacy technology stack.'
    },
    {
        name: 'AgileInnovate',
        website: 'https://example.com',
        threatLevel: 'Medium',
        strengths: 'Modern UI/UX, aggressive pricing strategy.',
        weaknesses: 'Limited feature set, small implementation team.'
    }
];

const MarketTab: React.FC<MarketTabProps> = ({ plan }) => {
    const isNew = plan.isNew;

    const getThreatColor = (level: string) => {
        switch(level) {
            case 'High': return 'bg-red-100 text-red-700 border-red-200';
            case 'Medium': return 'bg-orange-100 text-orange-700 border-orange-200';
            case 'Low': return 'bg-green-100 text-green-700 border-green-200';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* 1.5.1 Industry & Market */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative group">
                <button className={`absolute top-6 right-6 p-1.5 rounded transition-colors opacity-0 group-hover:opacity-100 ${isNew ? 'bg-blue-600 text-white opacity-100 shadow-sm' : 'text-slate-400 hover:bg-slate-50 hover:text-blue-600'}`}>
                    {isNew ? <Plus size={16} /> : <Edit2 size={16} />}
                </button>

                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <TrendingUp size={20} className="text-blue-600" />
                            Industry & Market Analysis
                        </h3>
                        <p className="text-sm text-slate-500">{isNew ? 'No industry data' : 'Manufacturing & Supply Chain'}</p>
                    </div>
                    {!isNew && (
                        <button className="flex items-center gap-2 text-sm text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors font-medium mr-8">
                            <Download size={16} /> Import Data
                        </button>
                    )}
                </div>

                {isNew ? (
                    <div className="flex flex-col items-center justify-center text-slate-400 min-h-[150px] border-2 border-dashed border-slate-100 rounded-xl">
                        <div className="bg-slate-50 p-4 rounded-full mb-3">
                            <BarChart3 size={32} />
                        </div>
                        <p className="text-sm font-medium">Industry data is missing</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                             <div className="flex gap-4">
                                <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 flex-1">
                                    <div className="text-xs text-slate-500 font-medium uppercase mb-1">Avg Margin</div>
                                    <div className="text-2xl font-bold text-slate-800">12.5%</div>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 flex-1">
                                    <div className="text-xs text-slate-500 font-medium uppercase mb-1">YOY Growth</div>
                                    <div className="text-2xl font-bold text-green-600">+4.2%</div>
                                </div>
                             </div>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-semibold text-slate-700 text-sm">Key Trends</h4>
                            <ul className="space-y-2 text-sm text-slate-600 list-disc list-inside">
                                <li>Shift towards AI-driven inventory management.</li>
                                <li>Increased focus on sustainable manufacturing processes.</li>
                                <li>Consolidation of smaller logistics providers.</li>
                            </ul>
                        </div>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 1.5.2 SWOT Matrix */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col h-full">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <Search size={20} className="text-purple-600" />
                            SWOT Matrix
                        </h3>
                        <button className="text-xs text-blue-600 hover:underline">Edit SWOT</button>
                    </div>
                    
                    <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-4 text-sm">
                        <div className="bg-green-50 border border-green-100 p-4 rounded-lg">
                            <span className="font-bold text-green-800 block mb-2 uppercase text-xs tracking-wider">Strengths</span>
                            <ul className="space-y-1 text-green-900 list-disc list-inside text-xs">
                                <li>Market Leader in APAC</li>
                                <li>Strong R&D capabilities</li>
                            </ul>
                        </div>
                        <div className="bg-red-50 border border-red-100 p-4 rounded-lg">
                            <span className="font-bold text-red-800 block mb-2 uppercase text-xs tracking-wider">Weaknesses</span>
                            <ul className="space-y-1 text-red-900 list-disc list-inside text-xs">
                                <li>Legacy IT systems</li>
                                <li>High operational costs</li>
                            </ul>
                        </div>
                        <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg">
                            <span className="font-bold text-blue-800 block mb-2 uppercase text-xs tracking-wider">Opportunities</span>
                            <ul className="space-y-1 text-blue-900 list-disc list-inside text-xs">
                                <li>Digital transformation demand</li>
                                <li>Cloud migration</li>
                            </ul>
                        </div>
                         <div className="bg-orange-50 border border-orange-100 p-4 rounded-lg">
                            <span className="font-bold text-orange-800 block mb-2 uppercase text-xs tracking-wider">Threats</span>
                            <ul className="space-y-1 text-orange-900 list-disc list-inside text-xs">
                                <li>Aggressive startups</li>
                                <li>Regulatory changes</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* 1.5.3 Risks & Challenges */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col h-full">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <AlertTriangle size={20} className="text-orange-500" />
                            Risks & Challenges
                        </h3>
                        <button className="text-blue-600 hover:bg-blue-50 p-1 rounded"><Plus size={16} /></button>
                    </div>

                    <div className="space-y-3">
                         {[
                             { risk: 'Budget Cuts', impact: 'High', prob: 'Medium', mitigation: 'Focus on ROI-driven solutions' },
                             { risk: 'Competitor Entry', impact: 'Medium', prob: 'High', mitigation: 'Lock in multi-year contracts' },
                             { risk: 'Technical Debt', impact: 'High', prob: 'High', mitigation: 'Propose phased modernization' }
                         ].map((item, i) => (
                             <div key={i} className="p-3 border border-slate-100 rounded-lg hover:border-orange-200 transition-colors bg-white shadow-sm">
                                 <div className="flex justify-between mb-1">
                                     <span className="font-bold text-slate-800 text-sm">{item.risk}</span>
                                     <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.impact === 'High' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                         {item.impact} Impact
                                     </span>
                                 </div>
                                 <p className="text-xs text-slate-500 mb-2">Probability: {item.prob}</p>
                                 <div className="text-xs bg-slate-50 p-2 rounded text-slate-600 italic">
                                     <span className="font-semibold not-italic">Mitigation:</span> {item.mitigation}
                                 </div>
                             </div>
                         ))}
                    </div>
                </div>
            </div>

            {/* Competitor Analysis */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
                     <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <Swords size={20} className="text-red-600" />
                        Competitor Analysis
                    </h3>
                    <button className="flex items-center gap-2 text-sm text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors font-medium">
                        <Plus size={16} /> Add Competitor
                    </button>
                </div>
                
                <div className="overflow-x-auto">
                    {isNew ? (
                         <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                             <Swords size={32} className="mb-3 text-slate-300" />
                             <p className="text-sm font-medium">No competitors analyzed yet.</p>
                         </div>
                    ) : (
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 text-slate-500 font-semibold text-xs border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-4 w-1/4">Competitor</th>
                                    <th className="px-6 py-4 w-1/6">Threat Level</th>
                                    <th className="px-6 py-4">Strengths</th>
                                    <th className="px-6 py-4">Weaknesses</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {MOCK_COMPETITORS.map((comp, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 align-top">
                                            <div className="font-bold text-slate-800">{comp.name}</div>
                                            <a 
                                                href={comp.website} 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-1"
                                            >
                                                Website <ExternalLink size={10} />
                                            </a>
                                        </td>
                                        <td className="px-6 py-4 align-top">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getThreatColor(comp.threatLevel)}`}>
                                                {comp.threatLevel}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 align-top text-slate-600">
                                            {comp.strengths}
                                        </td>
                                        <td className="px-6 py-4 align-top text-slate-600">
                                            {comp.weaknesses}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MarketTab;