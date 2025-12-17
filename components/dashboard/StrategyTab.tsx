import React, { useState } from 'react';
import { Stakeholder, AccountPlan } from '../../types';
import { Plus, Users, Contact, Info, Search } from 'lucide-react';
import Modal from '../ui/Modal';

interface StrategyTabProps {
    plan: AccountPlan;
}

const INITIAL_MOCK_STAKEHOLDERS: Stakeholder[] = [
    { id: '1', name: 'Alex Rivera', role: 'Decision Maker', title: 'CEO', influence: 85, interest: 85, sentiment: 'Positive' },
    { id: '2', name: 'David Lee', role: 'Blocker', title: 'Head of Procurement', influence: 15, interest: 25, sentiment: 'Negative' },
    { id: '3', name: 'Ben Novak', role: 'Influencer', title: 'CTO', influence: 80, interest: 40, sentiment: 'Positive' },
    { id: '4', name: 'Carla Santos', role: 'Influencer', title: 'VP of Sales', influence: 80, interest: 30, sentiment: 'Neutral' },
];

const StrategyTab: React.FC<StrategyTabProps> = ({ plan }) => {
    const isNew = plan.isNew;
    const [stakeholders, setStakeholders] = useState<Stakeholder[]>(isNew ? [] : INITIAL_MOCK_STAKEHOLDERS);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    
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

    const getSentimentColor = (sentiment: string) => {
        switch(sentiment) {
            case 'Positive': return 'bg-green-500';
            case 'Negative': return 'bg-red-500';
            default: return 'bg-amber-400';
        }
    };

    const getSentimentBg = (sentiment: string) => {
        switch(sentiment) {
            case 'Positive': return 'bg-green-100 text-green-700';
            case 'Negative': return 'bg-red-100 text-red-700';
            default: return 'bg-amber-100 text-amber-700';
        }
    };

    const filteredStakeholders = stakeholders.filter(s => 
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        s.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 {/* 1.6.1 Stakeholder List */}
                 <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-[600px] lg:col-span-1">
                    <div className="p-4 border-b border-slate-200 bg-slate-50/50 space-y-3">
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                <Contact size={18} className="text-blue-600" />
                                Stakeholder List
                            </h3>
                            <button onClick={() => setIsModalOpen(true)} className="p-1.5 rounded bg-blue-600 text-white hover:bg-blue-700 shadow-sm">
                                <Plus size={16} />
                            </button>
                        </div>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                            <input 
                                type="text" 
                                placeholder="Search stakeholder..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            />
                        </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {filteredStakeholders.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400">
                                <p className="text-sm">No stakeholders found</p>
                            </div>
                        ) : (
                            filteredStakeholders.map(person => (
                                <div key={person.id} className="p-3 rounded-lg border border-slate-100 bg-white hover:border-blue-300 transition-colors cursor-pointer group shadow-sm">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-3">
                                             <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${getSentimentBg(person.sentiment)}`}>
                                                 {person.name.charAt(0)}
                                             </div>
                                             <div>
                                                <div className="font-semibold text-slate-800 text-sm">{person.name}</div>
                                                <div className="text-xs text-slate-500">{person.title}</div>
                                            </div>
                                        </div>
                                        <div className={`w-2 h-2 rounded-full mt-1.5 ${getSentimentColor(person.sentiment)}`}></div>
                                    </div>
                                    <div className="mt-2 flex items-center gap-2 pl-11">
                                        <span className="px-2 py-0.5 bg-slate-50 border border-slate-200 rounded text-[10px] text-slate-600 font-medium">
                                            {person.role}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* 1.6.2 Influence Map - Custom Implementation */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-[600px] flex flex-col relative">
                     <div className="flex justify-between items-center mb-2">
                         <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                             <Users size={20} className="text-purple-600" />
                             Influence Map
                         </h3>
                         <button className="text-slate-400 hover:text-slate-600">
                             <Info size={16} />
                         </button>
                    </div>
                    
                    <div className="flex-1 relative pt-8 pb-8 pl-12 pr-4 min-h-0">
                        {/* Top X Axis Labels */}
                        <div className="absolute top-0 left-12 right-4 flex justify-between text-xs text-slate-500">
                             <span className="text-blue-900 font-medium">Low Influence</span>
                             <span className="font-bold text-slate-800 text-sm uppercase tracking-wide">Influence Level</span>
                             <span className="text-blue-900 font-medium">High Influence</span>
                        </div>
                        
                        {/* Left Y Axis Labels */}
                        <div className="absolute top-8 bottom-8 left-0 w-8 flex flex-col justify-between items-center text-xs text-slate-500 py-4">
                             <span className="-rotate-90 whitespace-nowrap text-blue-900 font-medium">Supporter</span>
                             <span className="-rotate-90 font-bold text-slate-800 text-sm uppercase tracking-wide whitespace-nowrap">Support Level</span>
                             <span className="-rotate-90 whitespace-nowrap text-blue-900 font-medium">Blocker</span>
                        </div>

                        {/* Chart Area */}
                        <div className="relative w-full h-full border-2 border-slate-100 rounded-lg bg-slate-50/20">
                            {/* Grid Lines */}
                            <div className="absolute top-0 bottom-0 left-1/2 w-px border-l-2 border-dashed border-slate-200"></div>
                            <div className="absolute left-0 right-0 top-1/2 h-px border-t-2 border-dashed border-slate-200"></div>
                            
                            {/* Quadrant Labels */}
                            <div className="absolute top-4 left-4 text-[11px] font-bold text-amber-500 uppercase tracking-wider bg-amber-50 px-2 py-1 rounded">Monitor</div>
                            <div className="absolute top-4 right-4 text-[11px] font-bold text-green-600 uppercase tracking-wider bg-green-50 px-2 py-1 rounded">Keep Satisfied (Champions)</div>
                            <div className="absolute bottom-4 left-4 text-[11px] font-bold text-red-500 uppercase tracking-wider bg-red-50 px-2 py-1 rounded">Keep Informed</div>
                            <div className="absolute bottom-4 right-4 text-[11px] font-bold text-green-600 uppercase tracking-wider bg-green-50 px-2 py-1 rounded">Manage Closely (Supporters)</div>

                            {/* Stakeholders Cards */}
                            {stakeholders.length === 0 ? (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center">
                                        <p className="text-slate-400 text-sm mb-2">No stakeholders mapped</p>
                                        <button onClick={() => setIsModalOpen(true)} className="text-blue-600 text-sm font-medium hover:underline flex items-center justify-center gap-1">
                                            <Plus size={16} /> Add First
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                stakeholders.map(s => (
                                    <div 
                                        key={s.id}
                                        className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10 hover:z-20 transition-all cursor-pointer group"
                                        style={{ left: `${s.influence}%`, top: `${100 - s.interest}%` }}
                                    >
                                        <div className="flex items-center gap-3 bg-white p-2.5 rounded-xl shadow-sm border border-slate-200 group-hover:shadow-md group-hover:border-blue-300 w-48 relative overflow-hidden">
                                            {/* Colored Side Bar */}
                                            <div className={`absolute left-0 top-0 bottom-0 w-1 ${getSentimentColor(s.sentiment)}`}></div>
                                            
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ml-1 ${getSentimentBg(s.sentiment)}`}>
                                                {s.name.split(' ').map(n => n[0]).join('').substring(0,2)}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="text-xs font-bold text-slate-800 truncate leading-tight">{s.name}</div>
                                                <div className="text-[10px] text-slate-500 truncate mt-0.5">{s.title}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
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
                            <div className="flex justify-between text-xs text-slate-400 mt-1">
                                <span>Low</span>
                                <span className="text-slate-700 font-bold">{newStakeholder.influence}</span>
                                <span>High</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Support Level (0-100)</label>
                            <input type="range" min="0" max="100" value={newStakeholder.interest} onChange={e => setNewStakeholder({...newStakeholder, interest: parseInt(e.target.value)})} className="w-full" />
                            <div className="flex justify-between text-xs text-slate-400 mt-1">
                                <span>Blocker</span>
                                <span className="text-slate-700 font-bold">{newStakeholder.interest}</span>
                                <span>Supporter</span>
                            </div>
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