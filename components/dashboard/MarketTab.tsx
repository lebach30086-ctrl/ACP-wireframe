
import React, { useState } from 'react';
import { Download, BarChart3, Plus, Edit2, AlertTriangle, TrendingUp, Search, Swords, Trash2, Globe, Save, X } from 'lucide-react';
import { AccountPlan } from '../../types';
import Modal from '../ui/Modal';

interface MarketTabProps {
    plan: AccountPlan;
}

interface Competitor {
    id: string;
    name: string;
    website: string;
    threatLevel: 'High' | 'Medium' | 'Low';
    strengths: string;
    weaknesses: string;
    differentiatingFactors?: string;
}

interface Risk {
    id: string;
    risk: string;
    impact: 'High' | 'Medium' | 'Low';
    prob: 'High' | 'Medium' | 'Low';
    mitigation: string;
}

const INITIAL_MOCK_COMPETITORS: Competitor[] = [
    {
        id: '1',
        name: 'TechGiant Solutions',
        website: 'https://example.com',
        threatLevel: 'High',
        strengths: 'Extensive global infrastructure, deep pockets for R&D.',
        weaknesses: 'Slow customer support, legacy technology stack.',
        differentiatingFactors: 'Our personalized service model and agile customization capabilities allow us to adapt faster to client needs.'
    },
    {
        id: '2',
        name: 'AgileInnovate',
        website: 'https://example.com',
        threatLevel: 'Medium',
        strengths: 'Modern UI/UX, aggressive pricing strategy.',
        weaknesses: 'Limited feature set, small implementation team.',
        differentiatingFactors: 'We offer a more comprehensive feature suite and enterprise-grade security compliance that they lack.'
    }
];

const MarketTab: React.FC<MarketTabProps> = ({ plan }) => {
    const isNew = plan.isNew;
    const [competitors, setCompetitors] = useState<Competitor[]>(isNew ? [] : INITIAL_MOCK_COMPETITORS);
    const [isCompModalOpen, setIsCompModalOpen] = useState(false);
    const [isSwotModalOpen, setIsSwotModalOpen] = useState(false);
    const [isIndustryModalOpen, setIsIndustryModalOpen] = useState(false);
    const [editingCompetitorId, setEditingCompetitorId] = useState<string | null>(null);
    
    // Industry Data State
    const [industryData, setIndustryData] = useState({
        industry: isNew ? '' : 'Manufacturing & Supply Chain',
        avgMargin: isNew ? '' : '12.5%',
        yoyGrowth: isNew ? '' : '+4.2%',
        trends: isNew ? [] : [
            'Shift towards AI-driven inventory management.',
            'Increased focus on sustainable manufacturing processes.',
            'Consolidation of smaller logistics providers.'
        ]
    });
    const [industryEdit, setIndustryEdit] = useState({ ...industryData });

    // SWOT State
    const [swot, setSwot] = useState({
        strengths: ['Market Leader in APAC', 'Strong R&D capabilities'],
        weaknesses: ['Legacy IT systems', 'High operational costs'],
        opportunities: ['Digital transformation demand', 'Cloud migration'],
        threats: ['Aggressive startups', 'Regulatory changes']
    });

    const [swotEdit, setSwotEdit] = useState({ 
        strengths: swot.strengths.join(' '), 
        weaknesses: swot.weaknesses.join(' '), 
        opportunities: swot.opportunities.join(' '), 
        threats: swot.threats.join(' ') 
    });

    // Risks State
    const [risks, setRisks] = useState<Risk[]>([
        { id: '1', risk: 'Budget Cuts', impact: 'High', prob: 'Medium', mitigation: 'Focus on ROI-driven solutions' },
        { id: '2', risk: 'Competitor Entry', impact: 'Medium', prob: 'High', mitigation: 'Lock in multi-year contracts' },
        { id: '3', risk: 'Technical Debt', impact: 'High', prob: 'High', mitigation: 'Propose phased modernization' }
    ]);

    // Form State for Competitor
    const [compFormData, setCompFormData] = useState<Partial<Competitor>>({
        name: '',
        website: '',
        threatLevel: 'Medium',
        strengths: '',
        weaknesses: '',
        differentiatingFactors: ''
    });

    const getThreatColor = (level: string) => {
        switch(level) {
            case 'High': return 'bg-red-100 text-red-700 border-red-200';
            case 'Medium': return 'bg-orange-100 text-orange-700 border-orange-200';
            case 'Low': return 'bg-green-100 text-green-700 border-green-200';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    const handleAddCompetitor = () => {
        if (compFormData.name) {
            if (editingCompetitorId) {
                setCompetitors(competitors.map(c => 
                    c.id === editingCompetitorId 
                    ? { ...c, ...compFormData } as Competitor 
                    : c
                ));
            } else {
                const newComp: Competitor = {
                    id: Date.now().toString(),
                    name: compFormData.name!,
                    website: compFormData.website || '',
                    threatLevel: compFormData.threatLevel as any || 'Medium',
                    strengths: compFormData.strengths || '',
                    weaknesses: compFormData.weaknesses || '',
                    differentiatingFactors: compFormData.differentiatingFactors || ''
                };
                setCompetitors([...competitors, newComp]);
            }
            setIsCompModalOpen(false);
            setEditingCompetitorId(null);
            setCompFormData({ name: '', website: '', threatLevel: 'Medium', strengths: '', weaknesses: '', differentiatingFactors: '' });
        }
    };

    const handleEditCompetitor = (comp: Competitor) => {
        setEditingCompetitorId(comp.id);
        setCompFormData({
            name: comp.name,
            website: comp.website,
            threatLevel: comp.threatLevel,
            strengths: comp.strengths,
            weaknesses: comp.weaknesses,
            differentiatingFactors: comp.differentiatingFactors
        });
        setIsCompModalOpen(true);
    };

    const handleSaveSwot = () => {
        setSwot({
            strengths: swotEdit.strengths.split('. ').filter(s => s.trim()),
            weaknesses: swotEdit.weaknesses.split('. ').filter(s => s.trim()),
            opportunities: swotEdit.opportunities.split('. ').filter(s => s.trim()),
            threats: swotEdit.threats.split('. ').filter(s => s.trim()),
        });
        setIsSwotModalOpen(false);
    };
    
    const handleSaveIndustry = () => {
        setIndustryData({ ...industryEdit });
        setIsIndustryModalOpen(false);
    };

    const handleDeleteCompetitor = (id: string) => {
        setCompetitors(competitors.filter(c => c.id !== id));
    };

    return (
        <div className="space-y-6">
            {/* 1.5.1 Industry & Market */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative group">
                <button 
                    onClick={() => { setIndustryEdit({...industryData}); setIsIndustryModalOpen(true); }}
                    className={`absolute top-6 right-6 p-1.5 rounded transition-colors opacity-0 group-hover:opacity-100 ${isNew ? 'bg-blue-600 text-white opacity-100 shadow-sm' : 'text-slate-400 hover:bg-slate-50 hover:text-blue-600'}`}
                >
                    {isNew ? <Plus size={16} /> : <Edit2 size={16} />}
                </button>

                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <TrendingUp size={20} className="text-blue-600" />
                            Industry & Market Analysis
                        </h3>
                        <p className="text-sm text-slate-500">{industryData.industry || 'No industry data'}</p>
                    </div>
                </div>

                {isNew && !industryData.industry ? (
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
                                    <div className="text-2xl font-bold text-slate-800">{industryData.avgMargin}</div>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 flex-1">
                                    <div className="text-xs text-slate-500 font-medium uppercase mb-1">YOY Growth</div>
                                    <div className="text-2xl font-bold text-green-600">{industryData.yoyGrowth}</div>
                                </div>
                             </div>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-semibold text-slate-700 text-sm">Key Trends</h4>
                            <ul className="space-y-2 text-sm text-slate-600 list-disc list-inside">
                                {industryData.trends.map((trend, i) => (
                                    <li key={i}>{trend}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* SWOT Matrix Card */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col h-full">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <Search size={20} className="text-purple-600" />
                            SWOT Matrix
                        </h3>
                        <button 
                            onClick={() => { 
                                setSwotEdit({ 
                                    strengths: swot.strengths.join(' '), 
                                    weaknesses: swot.weaknesses.join(' '), 
                                    opportunities: swot.opportunities.join(' '), 
                                    threats: swot.threats.join(' ') 
                                }); 
                                setIsSwotModalOpen(true); 
                            }}
                            className="text-xs text-blue-600 font-bold hover:underline"
                        >
                            Edit SWOT
                        </button>
                    </div>
                    
                    <div className="flex-1 grid grid-cols-2 gap-4 text-xs">
                        <div className="bg-green-50 border border-green-100 p-4 rounded-xl">
                            <span className="font-black text-green-700 block mb-2 uppercase tracking-widest">STRENGTHS</span>
                            <ul className="space-y-1.5 text-green-900 list-none font-medium">
                                {swot.strengths.map((s, i) => (
                                    <li key={i} className="flex gap-2"><span className="text-green-500">•</span> {s}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-red-50 border border-red-100 p-4 rounded-xl">
                            <span className="font-black text-red-700 block mb-2 uppercase tracking-widest">WEAKNESSES</span>
                            <ul className="space-y-1.5 text-red-900 list-none font-medium">
                                {swot.weaknesses.map((s, i) => (
                                    <li key={i} className="flex gap-2"><span className="text-red-500">•</span> {s}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl">
                            <span className="font-black text-blue-700 block mb-2 uppercase tracking-widest">OPPORTUNITIES</span>
                            <ul className="space-y-1.5 text-blue-900 list-none font-medium">
                                {swot.opportunities.map((s, i) => (
                                    <li key={i} className="flex gap-2"><span className="text-blue-500">•</span> {s}</li>
                                ))}
                            </ul>
                        </div>
                         <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl">
                            <span className="font-black text-orange-700 block mb-2 uppercase tracking-widest">THREATS</span>
                            <ul className="space-y-1.5 text-orange-900 list-none font-medium">
                                {swot.threats.map((s, i) => (
                                    <li key={i} className="flex gap-2"><span className="text-orange-500">•</span> {s}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Risks & Challenges Card */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col h-full">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <AlertTriangle size={20} className="text-orange-500" />
                            Risks & Challenges
                        </h3>
                        <button className="text-blue-600 hover:bg-blue-50 p-1.5 rounded-lg border border-transparent hover:border-blue-100 transition-all"><Plus size={18} /></button>
                    </div>

                    <div className="space-y-4">
                         {risks.map((item) => (
                             <div key={item.id} className="p-4 border border-slate-200 rounded-xl transition-all bg-white hover:shadow-md">
                                 <div className="flex justify-between items-start mb-2">
                                     <span className="font-bold text-slate-800 text-sm">{item.risk}</span>
                                     <span className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wide border ${item.impact === 'High' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-orange-50 text-orange-600 border-orange-100'}`}>
                                         {item.impact} Impact
                                     </span>
                                 </div>
                                 <p className="text-xs text-slate-500 font-medium mb-3">Probability: {item.prob}</p>
                                 <div className="text-[11px] bg-slate-50/80 p-3 rounded-lg text-slate-700 border border-slate-100 italic leading-relaxed">
                                     <span className="font-bold not-italic text-slate-500 uppercase text-[9px] tracking-widest block mb-1">Mitigation:</span> {item.mitigation}
                                 </div>
                             </div>
                         ))}
                    </div>
                </div>
            </div>

            {/* Competitor Analysis Section */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-white">
                     <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <Swords size={22} className="text-red-600" />
                        Competitor Analysis
                    </h3>
                    <button 
                        onClick={() => {
                            setEditingCompetitorId(null);
                            setCompFormData({ name: '', website: '', threatLevel: 'Medium', strengths: '', weaknesses: '', differentiatingFactors: '' });
                            setIsCompModalOpen(true);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg border border-blue-100 transition-all shadow-sm"
                        title="Add Competitor"
                    >
                        <Plus size={20} />
                    </button>
                </div>
                
                <div className="overflow-x-auto">
                    {competitors.length === 0 ? (
                         <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                             <div className="bg-slate-50 p-6 rounded-full mb-4">
                                <Swords size={48} className="text-slate-200" />
                             </div>
                             <p className="text-sm font-medium">No competitors analyzed yet.</p>
                             <button onClick={() => setIsCompModalOpen(true)} className="mt-4 text-blue-600 text-sm font-semibold hover:underline">Analyze your first competitor</button>
                         </div>
                    ) : (
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50/50 text-slate-500 font-bold text-[11px] uppercase tracking-wider border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-4 w-[15%]">COMPETITOR</th>
                                    <th className="px-6 py-4 w-[10%]">THREAT</th>
                                    <th className="px-6 py-4 w-[20%]">STRENGTHS</th>
                                    <th className="px-6 py-4 w-[20%]">WEAKNESSES</th>
                                    <th className="px-6 py-4 w-[25%] bg-blue-50/50 text-blue-800 border-l border-blue-100/50">DIFFERENTIATING FACTORS (USP)</th>
                                    <th className="px-6 py-4 w-[10%] text-right"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {competitors.map((comp) => (
                                    <tr key={comp.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-5 align-top">
                                            <div className="font-bold text-slate-800 text-sm">{comp.name}</div>
                                            {comp.website && (
                                                <a 
                                                    href={comp.website.startsWith('http') ? comp.website : `https://${comp.website}`} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer" 
                                                    className="text-[11px] text-blue-600 hover:underline flex items-center gap-1 mt-1 font-medium"
                                                >
                                                    <Globe size={10} /> Visit Website
                                                </a>
                                            )}
                                        </td>
                                        <td className="px-6 py-5 align-top">
                                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getThreatColor(comp.threatLevel)}`}>
                                                {comp.threatLevel}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 align-top text-slate-600 leading-relaxed text-xs font-medium">
                                            {comp.strengths}
                                        </td>
                                        <td className="px-6 py-5 align-top text-slate-600 leading-relaxed text-xs font-medium">
                                            {comp.weaknesses}
                                        </td>
                                        <td className="px-6 py-5 align-top text-slate-700 leading-relaxed text-xs font-medium bg-blue-50/30 border-l border-blue-100/50">
                                            {comp.differentiatingFactors || <span className="text-slate-400 italic">Not defined</span>}
                                        </td>
                                        <td className="px-6 py-5 align-top text-right">
                                            <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button 
                                                    onClick={() => handleEditCompetitor(comp)}
                                                    className="text-slate-400 hover:text-blue-600 p-2 rounded-full hover:bg-blue-50 transition-all"
                                                    title="Edit Competitor"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteCompetitor(comp.id)}
                                                    className="text-slate-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-all"
                                                    title="Remove Competitor"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Industry & Market Analysis Edit Modal */}
            <Modal
                isOpen={isIndustryModalOpen}
                onClose={() => setIsIndustryModalOpen(false)}
                title="Edit Industry & Market Analysis"
                maxWidth="max-w-xl"
            >
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Industry Name / Segment</label>
                        <input 
                            type="text" 
                            value={industryEdit.industry} 
                            onChange={e => setIndustryEdit({...industryEdit, industry: e.target.value})} 
                            className="w-full px-3 py-2 border border-neutral-300 bg-white text-slate-900 rounded-[6px] focus:ring-2 focus:ring-blue-500 outline-none text-sm" 
                            placeholder="e.g. Manufacturing & Supply Chain" 
                        />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Avg Margin</label>
                            <input 
                                type="text" 
                                value={industryEdit.avgMargin} 
                                onChange={e => setIndustryEdit({...industryEdit, avgMargin: e.target.value})} 
                                className="w-full px-3 py-2 border border-neutral-300 bg-white text-slate-900 rounded-[6px] focus:ring-2 focus:ring-blue-500 outline-none text-sm" 
                                placeholder="e.g. 12.5%" 
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">YOY Growth</label>
                            <input 
                                type="text" 
                                value={industryEdit.yoyGrowth} 
                                onChange={e => setIndustryEdit({...industryEdit, yoyGrowth: e.target.value})} 
                                className="w-full px-3 py-2 border border-neutral-300 bg-white text-slate-900 rounded-[6px] focus:ring-2 focus:ring-blue-500 outline-none text-sm" 
                                placeholder="e.g. +4.2%" 
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Key Trends (One per line)</label>
                        <textarea 
                            value={industryEdit.trends.join('\n')} 
                            onChange={e => setIndustryEdit({...industryEdit, trends: e.target.value.split('\n')})} 
                            className="w-full px-3 py-2 border border-neutral-300 bg-white text-slate-900 rounded-[6px] focus:ring-2 focus:ring-blue-500 outline-none text-sm min-h-[120px]" 
                            placeholder="Enter trends..."
                        />
                    </div>

                    <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                        <button 
                            onClick={() => setIsIndustryModalOpen(false)} 
                            className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-bold text-sm"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleSaveIndustry} 
                            className="px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-bold text-sm shadow-md shadow-blue-100"
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            </Modal>

            {/* SWOT Edit Modal - Redesigned per screenshot */}
            <Modal 
                isOpen={isSwotModalOpen} 
                onClose={() => setIsSwotModalOpen(false)} 
                title="Edit SWOT Matrix"
                maxWidth="max-w-[80%]"
            >
                <div className="py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-12">
                        {/* STRENGTHS */}
                        <div className="space-y-4">
                            <label className="text-[14px] font-bold text-green-600 uppercase tracking-widest block px-1">STRENGTHS</label>
                            <textarea 
                                value={swotEdit.strengths} 
                                onChange={e => setSwotEdit({...swotEdit, strengths: e.target.value})} 
                                className="w-full p-6 border border-slate-100 bg-white text-slate-700 rounded-2xl focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none text-sm min-h-[160px] shadow-sm transition-all" 
                                placeholder="Market Leader in APAC Strong R&D capabilities"
                            />
                        </div>
                        {/* WEAKNESSES */}
                        <div className="space-y-4">
                            <label className="text-[14px] font-bold text-red-600 uppercase tracking-widest block px-1">WEAKNESSES</label>
                            <textarea 
                                value={swotEdit.weaknesses} 
                                onChange={e => setSwotEdit({...swotEdit, weaknesses: e.target.value})} 
                                className="w-full p-6 border border-slate-100 bg-white text-slate-700 rounded-2xl focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none text-sm min-h-[160px] shadow-sm transition-all" 
                                placeholder="Legacy IT systems High operational costs"
                            />
                        </div>
                        {/* OPPORTUNITIES */}
                        <div className="space-y-4">
                            <label className="text-[14px] font-bold text-blue-600 uppercase tracking-widest block px-1">OPPORTUNITIES</label>
                            <textarea 
                                value={swotEdit.opportunities} 
                                onChange={e => setSwotEdit({...swotEdit, opportunities: e.target.value})} 
                                className="w-full p-6 border border-slate-100 bg-white text-slate-700 rounded-2xl focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none text-sm min-h-[160px] shadow-sm transition-all" 
                                placeholder="Digital transformation demand Cloud migration"
                            />
                        </div>
                        {/* THREATS */}
                        <div className="space-y-4">
                            <label className="text-[14px] font-bold text-orange-600 uppercase tracking-widest block px-1">THREATS</label>
                            <textarea 
                                value={swotEdit.threats} 
                                onChange={e => setSwotEdit({...swotEdit, threats: e.target.value})} 
                                className="w-full p-6 border border-slate-100 bg-white text-slate-700 rounded-2xl focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none text-sm min-h-[160px] shadow-sm transition-all" 
                                placeholder="Aggressive startups Regulatory changes"
                            />
                        </div>
                    </div>
                    
                    <div className="mt-12 pt-8 flex justify-end items-center gap-6 border-t border-slate-100">
                        <button 
                            onClick={() => setIsSwotModalOpen(false)} 
                            className="px-6 py-2 text-slate-500 hover:text-slate-800 font-bold text-sm transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleSaveSwot} 
                            className="px-10 py-2.5 bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-bold text-sm shadow-[0_4px_12px_rgba(37,99,235,0.3)] transition-all active:scale-95"
                        >
                            Save SWOT
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Add/Edit Competitor Modal */}
            <Modal isOpen={isCompModalOpen} onClose={() => setIsCompModalOpen(false)} title={editingCompetitorId ? "Edit Competitor Analysis" : "Analyze New Competitor"}>
                <div className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[13px] font-semibold text-slate-700">Competitor Name <span className="text-red-500">*</span></label>
                            <input 
                                type="text" 
                                value={compFormData.name} 
                                onChange={e => setCompFormData({...compFormData, name: e.target.value})} 
                                className="w-full px-3 py-2 border border-neutral-300 bg-white text-slate-900 rounded-[6px] focus:ring-2 focus:ring-blue-500 outline-none text-sm placeholder-slate-400" 
                                placeholder="e.g. Acme Corp" 
                            />
                        </div>
                         <div className="space-y-1.5">
                            <label className="text-[13px] font-semibold text-slate-700">Website</label>
                            <div className="relative">
                                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                <input 
                                    type="text" 
                                    value={compFormData.website} 
                                    onChange={e => setCompFormData({...compFormData, website: e.target.value})} 
                                    className="w-full pl-9 pr-3 py-2 border border-neutral-300 bg-white text-slate-900 rounded-[6px] focus:ring-2 focus:ring-blue-500 outline-none text-sm placeholder-slate-400" 
                                    placeholder="www.example.com" 
                                />
                            </div>
                        </div>
                    </div>
                    
                    <div className="space-y-1.5">
                        <label className="text-[13px] font-semibold text-slate-700">Threat Level</label>
                        <div className="flex gap-3">
                            {['Low', 'Medium', 'High'].map((level) => (
                                <button
                                    key={level}
                                    type="button"
                                    onClick={() => setCompFormData({...compFormData, threatLevel: level as any})}
                                    className={`flex-1 py-2 px-4 rounded-lg border text-sm font-bold transition-all
                                        ${compFormData.threatLevel === level 
                                            ? (level === 'High' ? 'bg-red-600 text-white border-red-600' : level === 'Medium' ? 'bg-orange-500 text-white border-orange-500' : 'bg-green-600 text-white border-green-600')
                                            : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                                        }`}
                                >
                                    {level}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[13px] font-semibold text-slate-700">Key Strengths</label>
                        <textarea 
                            value={compFormData.strengths} 
                            onChange={e => setCompFormData({...compFormData, strengths: e.target.value})} 
                            className="w-full px-3 py-2 border border-neutral-300 bg-white text-slate-900 rounded-[6px] focus:ring-2 focus:ring-blue-500 outline-none text-sm min-h-[80px] placeholder-slate-400" 
                            placeholder="What do they do exceptionally well?"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[13px] font-semibold text-slate-700">Key Weaknesses</label>
                        <textarea 
                            value={compFormData.weaknesses} 
                            onChange={e => setCompFormData({...compFormData, weaknesses: e.target.value})} 
                            className="w-full px-3 py-2 border border-neutral-300 bg-white text-slate-900 rounded-[6px] focus:ring-2 focus:ring-blue-500 outline-none text-sm min-h-[80px] placeholder-slate-400" 
                            placeholder="Where are they vulnerable?"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[13px] font-semibold text-blue-800">Differentiating Factors (Your USP)</label>
                        <textarea 
                            value={compFormData.differentiatingFactors} 
                            onChange={e => setCompFormData({...compFormData, differentiatingFactors: e.target.value})} 
                            className="w-full px-3 py-2 border border-blue-200 bg-blue-50/30 text-slate-900 rounded-[6px] focus:ring-2 focus:ring-blue-500 outline-none text-sm min-h-[80px] placeholder-slate-400" 
                            placeholder="Why do we win against them? What is our unique advantage?"
                        />
                    </div>

                    <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 -mx-6 px-6">
                        <button 
                            onClick={() => {
                                setIsCompModalOpen(false);
                                setEditingCompetitorId(null);
                            }} 
                            className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-[6px] font-bold text-sm"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleAddCompetitor} 
                            disabled={!compFormData.name}
                            className="px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-[6px] font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-blue-100 flex items-center gap-2"
                        >
                            <Save size={16} /> {editingCompetitorId ? "Update Analysis" : "Save Competitor"}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default MarketTab;
