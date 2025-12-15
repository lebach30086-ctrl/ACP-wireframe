import React, { useState } from 'react';
import { 
    ResponsiveContainer, 
    ScatterChart, 
    Scatter, 
    XAxis, 
    YAxis, 
    Tooltip, 
    Cell,
    CartesianGrid,
    ReferenceLine
} from 'recharts';
import { Stakeholder, AccountPlan } from '../../types';
import { Plus, Edit2, Map, Users } from 'lucide-react';
import Modal from '../ui/Modal';

interface StrategyTabProps {
    plan: AccountPlan;
}

const INITIAL_MOCK_STAKEHOLDERS: Stakeholder[] = [
    { id: '1', name: 'Alice CEO', role: 'Decision Maker', title: 'CEO', influence: 90, interest: 80, sentiment: 'Positive' },
    { id: '2', name: 'Bob CTO', role: 'Influencer', title: 'CTO', influence: 85, interest: 40, sentiment: 'Neutral' },
    { id: '3', name: 'Charlie CFO', role: 'Blocker', title: 'CFO', influence: 95, interest: 20, sentiment: 'Negative' },
];

const StrategyTab: React.FC<StrategyTabProps> = ({ plan }) => {
    const isNew = plan.isNew;
    const [stakeholders, setStakeholders] = useState<Stakeholder[]>(isNew ? [] : INITIAL_MOCK_STAKEHOLDERS);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // New Stakeholder Form
    const [newStakeholder, setNewStakeholder] = useState<Partial<Stakeholder>>({
        name: '', title: '', role: 'Influencer', influence: 50, interest: 50, sentiment: 'Neutral'
    });

    const handleAddStakeholder = () => {
        if (newStakeholder.name) {
            const sh: Stakeholder = {
                id: Date.now().toString(),
                name: newStakeholder.name!,
                title: newStakeholder.title || '',
                role: newStakeholder.role as any,
                influence: newStakeholder.influence || 50,
                interest: newStakeholder.interest || 50,
                sentiment: newStakeholder.sentiment as any || 'Neutral'
            };
            setStakeholders([...stakeholders, sh]);
            setIsModalOpen(false);
            setNewStakeholder({ name: '', title: '', role: 'Influencer', influence: 50, interest: 50, sentiment: 'Neutral' });
        }
    };

    // Custom Tooltip for Scatter
    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-white p-3 border border-slate-200 shadow-lg rounded-lg">
                    <p className="font-bold text-slate-800">{data.name}</p>
                    <p className="text-xs text-slate-500">{data.title}</p>
                    <div className="flex gap-2 mt-1 text-xs">
                        <span>Inf: {data.influence}</span>
                        <span>Int: {data.interest}</span>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Strategy Map */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-slate-800">Strategic Alignment Map</h3>
                    {isNew && (
                         <button className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1">
                            <Plus size={16} /> Create Map
                        </button>
                    )}
                </div>
                
                {isNew ? (
                    <div className="p-12 flex flex-col items-center justify-center text-slate-400">
                        <div className="bg-slate-50 p-4 rounded-full mb-3">
                            <Map size={32} />
                        </div>
                        <p className="text-sm font-medium">Strategy not defined</p>
                        <p className="text-xs text-slate-400 mt-1">Map client goals to your solutions.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="font-bold text-slate-700">Client's Goals</h4>
                                <button className="text-blue-600 hover:bg-blue-50 p-1 rounded"><Edit2 size={16} /></button>
                            </div>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3">
                                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold shrink-0">1</span>
                                    <span className="text-sm text-slate-700">Reduce operational costs by 15% in FY24.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold shrink-0">2</span>
                                    <span className="text-sm text-slate-700">Expand market share in APAC region.</span>
                                </li>
                            </ul>
                        </div>
                        <div className="p-6 bg-slate-50/30">
                             <div className="flex justify-between items-center mb-4">
                                <h4 className="font-bold text-slate-700">Vendor's Strategy (Our Play)</h4>
                                <button className="text-blue-600 hover:bg-blue-50 p-1 rounded"><Edit2 size={16} /></button>
                            </div>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3">
                                    <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold shrink-0">1</span>
                                    <span className="text-sm text-slate-700">Position Automation Suite to address cost reduction.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold shrink-0">2</span>
                                    <span className="text-sm text-slate-700">Intro APAC support team capabilities to assist expansion.</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                )}
            </div>

            {/* Stakeholder Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Matrix Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-[500px] flex flex-col">
                    <div className="flex justify-between items-center mb-2">
                         <h3 className="text-lg font-bold text-slate-800">Stakeholder Matrix</h3>
                         <div className="flex gap-3 text-xs">
                             <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> Positive</span>
                             <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-400"></span> Neutral</span>
                             <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> Negative</span>
                         </div>
                    </div>
                    <p className="text-xs text-slate-500 mb-4">Influence (X) vs Interest (Y)</p>
                    
                    <div className="flex-1 w-full min-h-0 relative">
                        {stakeholders.length === 0 ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-100 rounded-xl bg-slate-50/30">
                                <div className="bg-slate-50 p-4 rounded-full mb-3">
                                    <Users size={32} />
                                </div>
                                <p className="text-sm font-medium mb-4">No stakeholders mapped</p>
                                <button onClick={() => setIsModalOpen(true)} className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1">
                                    <Plus size={16} /> Add Stakeholder
                                </button>
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 10 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis type="number" dataKey="influence" name="Influence" unit="" domain={[0, 100]} label={{ value: 'Influence', position: 'bottom', offset: 0 }} />
                                    <YAxis type="number" dataKey="interest" name="Interest" unit="" domain={[0, 100]} label={{ value: 'Interest', angle: -90, position: 'left' }} />
                                    <ReferenceLine x={50} stroke="#cbd5e1" strokeDasharray="3 3" />
                                    <ReferenceLine y={50} stroke="#cbd5e1" strokeDasharray="3 3" />
                                    <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
                                    <Scatter name="Stakeholders" data={stakeholders}>
                                        {stakeholders.map((entry, index) => {
                                            let color = '#94a3b8'; // Neutral
                                            if (entry.sentiment === 'Positive') color = '#22c55e';
                                            if (entry.sentiment === 'Negative') color = '#ef4444';
                                            return <Cell key={`cell-${index}`} fill={color} />;
                                        })}
                                    </Scatter>
                                </ScatterChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                {/* List View */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-[500px]">
                    <div className="p-4 border-b border-slate-200 flex justify-between items-center">
                        <h3 className="font-bold text-slate-800">Stakeholders</h3>
                        <button onClick={() => setIsModalOpen(true)} className="p-1.5 rounded bg-blue-50 text-blue-600 hover:bg-blue-100"><Plus size={16} /></button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {stakeholders.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400">
                                <p className="text-sm">List is empty</p>
                            </div>
                        ) : (
                            stakeholders.map(person => (
                                <div key={person.id} className="p-3 rounded-lg border border-slate-100 bg-slate-50 hover:border-blue-300 transition-colors cursor-pointer group">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="font-semibold text-slate-800 text-sm">{person.name}</div>
                                            <div className="text-xs text-slate-500">{person.title}</div>
                                        </div>
                                        <div className={`w-2 h-2 rounded-full mt-1.5 ${person.sentiment === 'Positive' ? 'bg-green-500' : person.sentiment === 'Negative' ? 'bg-red-500' : 'bg-slate-400'}`}></div>
                                    </div>
                                    <div className="mt-2 flex items-center gap-2">
                                        <span className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[10px] text-slate-600 font-medium">
                                            {person.role}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Stakeholder Modal */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Stakeholder">
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Name</label>
                            <input type="text" value={newStakeholder.name} onChange={e => setNewStakeholder({...newStakeholder, name: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Jane Doe" />
                        </div>
                         <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Job Title</label>
                            <input type="text" value={newStakeholder.title} onChange={e => setNewStakeholder({...newStakeholder, title: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="CTO" />
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Role</label>
                        <select value={newStakeholder.role} onChange={e => setNewStakeholder({...newStakeholder, role: e.target.value as any})} className="w-full px-3 py-2 border rounded-lg outline-none">
                            <option value="Decision Maker">Decision Maker</option>
                            <option value="Influencer">Influencer</option>
                            <option value="Champion">Champion</option>
                            <option value="Blocker">Blocker</option>
                            <option value="User">User</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Influence (0-100)</label>
                            <input type="range" min="0" max="100" value={newStakeholder.influence} onChange={e => setNewStakeholder({...newStakeholder, influence: parseInt(e.target.value)})} className="w-full" />
                            <div className="text-right text-xs text-slate-500">{newStakeholder.influence}</div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Interest (0-100)</label>
                            <input type="range" min="0" max="100" value={newStakeholder.interest} onChange={e => setNewStakeholder({...newStakeholder, interest: parseInt(e.target.value)})} className="w-full" />
                            <div className="text-right text-xs text-slate-500">{newStakeholder.interest}</div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Sentiment</label>
                        <div className="flex gap-4">
                            {['Positive', 'Neutral', 'Negative'].map((s) => (
                                <label key={s} className="flex items-center gap-2 cursor-pointer">
                                    <input 
                                        type="radio" 
                                        name="sentiment" 
                                        value={s} 
                                        checked={newStakeholder.sentiment === s} 
                                        onChange={() => setNewStakeholder({...newStakeholder, sentiment: s as any})}
                                        className="text-blue-600"
                                    />
                                    <span className={`text-sm ${s === 'Positive' ? 'text-green-600' : s === 'Negative' ? 'text-red-600' : 'text-slate-600'}`}>{s}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium">Cancel</button>
                        <button onClick={handleAddStakeholder} className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-medium">Add Stakeholder</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default StrategyTab;