import React, { useState } from 'react';
import { 
    ResponsiveContainer, 
    AreaChart, 
    Area, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip,
} from 'recharts';
import { TrendingUp, Target, Award, Plus, Edit2, BarChart2, ScanLine, FileText, Globe, Building, DollarSign, Wallet } from 'lucide-react';
import { AccountPlan } from '../../types';
import Modal from '../ui/Modal';

interface OverviewTabProps {
    plan: AccountPlan;
    onUpdatePlan: (fields: Partial<AccountPlan>) => void;
}

const REVENUE_DATA = [
    { month: 'Q1', actual: 120, target: 150 },
    { month: 'Q2', actual: 180, target: 160 },
    { month: 'Q3', actual: 240, target: 200 },
    { month: 'Q4', actual: null, target: 300 }, // Projected
];

const OverviewTab: React.FC<OverviewTabProps> = ({ plan, onUpdatePlan }) => {
    const isNew = plan.isNew;
    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
    
    // Form State
    const [profileForm, setProfileForm] = useState({
        industry: plan.industry || '',
        employees: plan.employees || '',
        location: plan.location || '',
        tier: plan.tier || 'Strategic',
    });

    const handleProfileSave = () => {
        onUpdatePlan(profileForm);
        setIsEditProfileOpen(false);
    };

    return (
        <div className="grid grid-cols-12 gap-6 animate-fade-in">
            {/* 1.4.1 Account Profile & 1.4.2 Identity */}
            <div className="col-span-12 lg:col-span-4 space-y-6">
                {/* Account Profile */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative group">
                    <button 
                        onClick={() => {
                            setProfileForm({
                                industry: plan.industry || '',
                                employees: plan.employees || '',
                                location: plan.location || '',
                                tier: plan.tier || 'Strategic',
                            });
                            setIsEditProfileOpen(true);
                        }}
                        className={`absolute top-4 right-4 p-1.5 rounded transition-colors ${isNew ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-50 hover:text-blue-600 opacity-0 group-hover:opacity-100'}`}
                    >
                        {isNew ? <Plus size={16} /> : <Edit2 size={16} />}
                    </button>
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Building size={20} className="text-blue-600"/> 
                        Account Profile
                    </h3>
                    
                    {isNew && !plan.industry && !plan.location ? (
                         <div className="flex flex-col items-center justify-center py-6 text-slate-400 border border-dashed border-slate-200 rounded-lg">
                            <p className="text-sm">Profile incomplete</p>
                            <button onClick={() => setIsEditProfileOpen(true)} className="text-blue-600 text-sm font-medium hover:underline">Complete Profile</button>
                         </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                                <span className="text-slate-500 text-sm">Industry</span>
                                <span className="font-medium text-slate-800">{plan.industry || 'Not set'}</span>
                            </div>
                            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                                <span className="text-slate-500 text-sm">Employees</span>
                                <span className="font-medium text-slate-800">{plan.employees || (isNew ? '-' : '5,000+')}</span>
                            </div>
                            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                                <span className="text-slate-500 text-sm">HQ Location</span>
                                <span className="font-medium text-slate-800">{plan.location || (isNew ? '-' : 'San Francisco, CA')}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-500 text-sm">Tier</span>
                                <span className={`px-2 py-0.5 rounded text-xs font-bold ${plan.tier === 'Strategic' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
                                    {plan.tier || (isNew ? 'Unassigned' : 'Strategic')}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* 1.4.5 & 1.4.6 Metrics (Moved Up) */}
                 <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-2 text-slate-500 mb-2">
                            <Target size={16} />
                            <span className="text-xs font-bold uppercase">Win Rate</span>
                        </div>
                        <div className="text-2xl font-bold text-slate-800">{plan.winRate}%</div>
                        {!isNew && (
                            <div className="text-xs text-green-600 flex items-center gap-1">
                                <TrendingUp size={12} /> +5% vs LY
                            </div>
                        )}
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-2 text-slate-500 mb-2">
                            <Award size={16} />
                            <span className="text-xs font-bold uppercase">Health Score</span>
                        </div>
                        <div className={`text-2xl font-bold ${isNew ? 'text-slate-300' : 'text-green-600'}`}>
                            {isNew ? '-' : '85'}
                        </div>
                        {!isNew && <div className="text-xs text-slate-400">Finance Health</div>}
                    </div>
                </div>

                {/* 1.4.2 Identity & Finance (Moved Down) */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <FileText size={20} className="text-indigo-600" />
                            Info & Finance
                        </h3>
                         <button className="flex items-center gap-1 text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded border border-indigo-100 hover:bg-indigo-100 transition-colors">
                            <ScanLine size={12} /> OCR Import
                        </button>
                    </div>

                    <div className="space-y-3">
                        <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                            <span className="text-xs text-slate-500 block mb-1">Tax Code</span>
                            <span className="font-mono text-sm text-slate-800 font-semibold">{isNew ? '--' : '0300300300'}</span>
                        </div>
                         <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                            <span className="text-xs text-slate-500 block mb-1">Annual Revenue (Last Year)</span>
                            <span className="font-mono text-sm text-slate-800 font-semibold">{isNew ? '--' : '$125M USD'}</span>
                        </div>
                        <div className="flex gap-2 mt-2">
                            <button className="flex-1 py-2 border border-dashed border-slate-300 rounded text-slate-500 text-xs hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center gap-1">
                                <Plus size={12} /> Financial Report
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* 1.4.3 & 1.4.4 Center/Right Column */}
            <div className="col-span-12 lg:col-span-8 space-y-6">
                 {/* 1.4.4 Revenue Performance */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm min-h-[300px] flex flex-col relative group">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                <DollarSign size={20} className="text-green-600" />
                                Revenue Performance
                            </h3>
                            <p className="text-sm text-slate-500">Actual vs Target (k USD)</p>
                        </div>
                        {!isNew && (
                            <div className="flex gap-2">
                                <div className="flex items-center gap-2 text-xs">
                                    <span className="w-3 h-3 bg-blue-500 rounded-full"></span> Actual
                                </div>
                                <div className="flex items-center gap-2 text-xs">
                                    <span className="w-3 h-3 bg-slate-300 rounded-full"></span> Target
                                </div>
                            </div>
                        )}
                    </div>
                    
                    <div className="flex-1">
                        {isNew ? (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-100 rounded-xl">
                                <div className="bg-slate-50 p-4 rounded-full mb-3">
                                    <BarChart2 size={32} />
                                </div>
                                <p className="text-sm font-medium">No revenue data recorded</p>
                            </div>
                        ) : (
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={REVENUE_DATA}>
                                        <defs>
                                            <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                                        <Tooltip 
                                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        />
                                        <Area type="monotone" dataKey="actual" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorActual)" />
                                        <Area type="monotone" dataKey="target" stroke="#cbd5e1" strokeWidth={2} strokeDasharray="5 5" fill="none" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </div>
                </div>

                {/* 1.4.3 Business Model Canvas */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                         <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                             <Globe size={20} className="text-blue-500" />
                             Business Model Canvas
                         </h3>
                         <button className="text-xs text-blue-600 hover:underline">Edit Canvas</button>
                    </div>
                    
                    {/* Simplified Canvas Grid */}
                    <div className="grid grid-cols-5 gap-2 h-[300px] text-xs">
                        <div className="col-span-1 bg-slate-50 border border-slate-200 p-2 rounded flex flex-col gap-1">
                            <span className="font-bold text-slate-700 block mb-1">Key Partners</span>
                             <p className="text-slate-600 line-clamp-4">- Tech Providers<br/>- Logistics Firms<br/>- Gov Agencies</p>
                        </div>
                        <div className="col-span-1 flex flex-col gap-2">
                             <div className="flex-1 bg-slate-50 border border-slate-200 p-2 rounded">
                                <span className="font-bold text-slate-700 block mb-1">Key Activities</span>
                                <p className="text-slate-600">R&D, Supply Chain Optimization</p>
                             </div>
                             <div className="flex-1 bg-slate-50 border border-slate-200 p-2 rounded">
                                <span className="font-bold text-slate-700 block mb-1">Key Resources</span>
                                <p className="text-slate-600">Data Centers, Skilled Workforce</p>
                             </div>
                        </div>
                        <div className="col-span-1 bg-blue-50 border border-blue-100 p-2 rounded flex flex-col gap-1">
                            <span className="font-bold text-blue-800 block mb-1">Value Propositions</span>
                            <p className="text-blue-700">- High efficiency<br/>- Low latency<br/>- Global reach</p>
                        </div>
                         <div className="col-span-1 flex flex-col gap-2">
                             <div className="flex-1 bg-slate-50 border border-slate-200 p-2 rounded">
                                <span className="font-bold text-slate-700 block mb-1">Relationships</span>
                                <p className="text-slate-600">Dedicated Support, Self-service portal</p>
                             </div>
                             <div className="flex-1 bg-slate-50 border border-slate-200 p-2 rounded">
                                <span className="font-bold text-slate-700 block mb-1">Channels</span>
                                <p className="text-slate-600">Direct Sales, Online</p>
                             </div>
                        </div>
                         <div className="col-span-1 bg-slate-50 border border-slate-200 p-2 rounded flex flex-col gap-1">
                            <span className="font-bold text-slate-700 block mb-1">Segments</span>
                            <p className="text-slate-600">- Enterprise<br/>- SMEs<br/>- Gov</p>
                        </div>
                        <div className="col-span-2 bg-slate-50 border border-slate-200 p-2 rounded">
                            <span className="font-bold text-slate-700 block mb-1">Cost Structure</span>
                            <p className="text-slate-600">Infrastructure, Salaries, Marketing</p>
                        </div>
                         <div className="col-span-3 bg-green-50 border border-green-100 p-2 rounded">
                            <span className="font-bold text-green-800 block mb-1">Revenue Streams</span>
                             <p className="text-green-700">Subscription Fees, Licensing, Consulting</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <Modal
                isOpen={isEditProfileOpen}
                onClose={() => setIsEditProfileOpen(false)}
                title="Edit Account Profile"
            >
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Industry</label>
                        <input 
                            type="text"
                            value={profileForm.industry}
                            onChange={(e) => setProfileForm({...profileForm, industry: e.target.value})}
                            className="w-full px-3 py-2 border border-slate-600 rounded-lg bg-slate-700 text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="e.g. Technology"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Employees</label>
                        <input 
                            type="text"
                            value={profileForm.employees}
                            onChange={(e) => setProfileForm({...profileForm, employees: e.target.value})}
                            className="w-full px-3 py-2 border border-slate-600 rounded-lg bg-slate-700 text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="e.g. 5,000+"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">HQ Location</label>
                        <input 
                            type="text"
                            value={profileForm.location}
                            onChange={(e) => setProfileForm({...profileForm, location: e.target.value})}
                            className="w-full px-3 py-2 border border-slate-600 rounded-lg bg-slate-700 text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="e.g. New York, NY"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Account Tier</label>
                        <select
                             value={profileForm.tier}
                             onChange={(e) => setProfileForm({...profileForm, tier: e.target.value})}
                             className="w-full px-3 py-2 border border-slate-600 rounded-lg bg-slate-700 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option value="Strategic">Strategic</option>
                            <option value="Growth">Growth</option>
                            <option value="Maintenance">Maintenance</option>
                        </select>
                    </div>
                    <div className="pt-4 flex justify-end gap-3">
                        <button onClick={() => setIsEditProfileOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium">Cancel</button>
                        <button onClick={handleProfileSave} className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-medium">Save Changes</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default OverviewTab;