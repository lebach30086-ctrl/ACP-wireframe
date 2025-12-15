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
import { TrendingUp, Target, Award, Calendar, Users, File, Plus, Edit2, BarChart2 } from 'lucide-react';
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
            {/* Account Profile Card */}
            <div className="col-span-12 lg:col-span-4 space-y-6">
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
                    <h3 className="text-lg font-bold text-slate-800 mb-4">Account Profile</h3>
                    
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

                {/* Key Metrics */}
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
                        {!isNew && <div className="text-xs text-slate-400">Out of 100</div>}
                    </div>
                </div>

                {/* Recent Projects */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col h-64">
                    <div className="flex justify-between items-center mb-4">
                         <h3 className="text-lg font-bold text-slate-800">Active Opportunities</h3>
                         {!isNew && <button className="text-blue-600 text-xs font-semibold">View All</button>}
                         {isNew && <button className="p-1 text-blue-600 hover:bg-blue-50 rounded"><Plus size={18} /></button>}
                    </div>
                    {isNew ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                             <div className="bg-slate-50 p-3 rounded-full mb-3">
                                <File size={24} />
                             </div>
                             <p className="text-sm font-medium">No active opportunities</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {[
                                { name: 'Cloud Migration Phase 2', val: '$450k', stage: 'Negotiation' },
                                { name: 'Security Audit', val: '$80k', stage: 'Discovery' },
                            ].map((proj, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                                    <div>
                                        <div className="font-medium text-sm text-slate-800">{proj.name}</div>
                                        <div className="text-xs text-slate-500">{proj.stage}</div>
                                    </div>
                                    <div className="font-bold text-slate-700 text-sm">{proj.val}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Performance Charts */}
            <div className="col-span-12 lg:col-span-8 space-y-6">
                 {/* Revenue Chart */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm min-h-[350px] flex flex-col relative group">
                     {isNew && (
                        <button className="absolute top-4 right-4 text-blue-600 font-medium text-sm flex items-center gap-1 hover:underline z-10">
                            <Plus size={16} /> Add Data
                        </button>
                    )}
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-slate-800">Revenue Performance</h3>
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

                {/* Timeline / Activity */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col min-h-[300px]">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-slate-800">Recent Timeline</h3>
                        <button className="text-blue-600 hover:bg-blue-50 p-1.5 rounded-lg transition-colors">
                            <Plus size={18} />
                        </button>
                    </div>
                    
                    {isNew ? (
                         <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                             <div className="bg-slate-50 p-4 rounded-full mb-3">
                                <Calendar size={32} />
                             </div>
                             <p className="text-sm font-medium">No recent activity logged</p>
                             <button className="mt-4 text-blue-600 text-sm font-medium hover:underline">Log Meeting or Event</button>
                        </div>
                    ) : (
                        <div className="relative border-l-2 border-slate-200 ml-3 space-y-8">
                            {[
                                { date: 'Oct 24, 2023', title: 'QBR Meeting', desc: 'Conducted Quarterly Business Review with CIO.', icon: Calendar, color: 'bg-purple-100 text-purple-600' },
                                { date: 'Oct 15, 2023', title: 'Contract Renewal', desc: 'Sent renewal proposal for FY2024.', icon: File, color: 'bg-blue-100 text-blue-600' },
                                { date: 'Sep 28, 2023', title: 'Stakeholder Meeting', desc: 'Lunch with VP of Engineering.', icon: Users, color: 'bg-green-100 text-green-600' }
                            ].map((item, i) => (
                                <div key={i} className="relative pl-8">
                                    <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-white ring-1 ring-slate-200 ${i===0 ? 'bg-blue-500' : 'bg-slate-300'}`}></div>
                                    <div>
                                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{item.date}</span>
                                        <h4 className="text-sm font-bold text-slate-800 mt-1">{item.title}</h4>
                                        <p className="text-sm text-slate-600 mt-1">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
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