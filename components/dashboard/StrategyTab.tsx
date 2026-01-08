
import React, { useState } from 'react';
import { Stakeholder, AccountPlan } from '../../types';
import { 
    Plus, 
    Users, 
    Search, 
    Mail, 
    Phone, 
    Building, 
    LayoutGrid, 
    Table as TableIcon,
    Edit2,
    Trash2,
    Save,
    ChevronDown
} from 'lucide-react';
import Modal from '../ui/Modal';

interface StrategyTabProps {
    plan: AccountPlan;
}

const INITIAL_MOCK_STAKEHOLDERS: Stakeholder[] = [
    { 
        id: '1', 
        name: 'Alex Rivera', 
        role: 'Decision Maker', 
        title: 'CEO', 
        influence: 85, 
        interest: 85, 
        sentiment: 'Positive',
        department: 'Executive',
        email: 'alex.rivera@tmz-investment.com',
        phone: '+84 901 234 567'
    },
    { 
        id: '2', 
        name: 'David Lee', 
        role: 'Blocker', 
        title: 'Head of Procurement', 
        influence: 35, 
        interest: 15, 
        sentiment: 'Negative',
        department: 'Procurement',
        email: 'david.lee@tmz-investment.com',
        phone: '+84 902 345 678'
    },
    { 
        id: '3', 
        name: 'Ben Novak', 
        role: 'Influencer', 
        title: 'CTO', 
        influence: 80, 
        interest: 40, 
        sentiment: 'Positive',
        department: 'Technology',
        email: 'ben.novak@tmz-investment.com',
        phone: '+84 903 456 789'
    },
    { 
        id: '4', 
        name: 'Carla Santos', 
        role: 'Influencer', 
        title: 'VP of Sales', 
        influence: 80, 
        interest: 30, 
        sentiment: 'Neutral',
        department: 'Sales',
        email: 'carla.santos@tmz-investment.com',
        phone: '+84 904 567 890'
    },
];

// Mock Stakeholder Profiles to select from
const STAKEHOLDER_PROFILES = [
    { name: 'Alex Rivera', title: 'CEO', department: 'Executive', email: 'alex.rivera@tmz-investment.com', phone: '+84 901 234 567' },
    { name: 'David Lee', title: 'Head of Procurement', department: 'Procurement', email: 'david.lee@tmz-investment.com', phone: '+84 902 345 678' },
    { name: 'Ben Novak', title: 'CTO', department: 'Technology', email: 'ben.novak@tmz-investment.com', phone: '+84 903 456 789' },
    { name: 'Carla Santos', title: 'VP of Sales', department: 'Sales', email: 'carla.santos@tmz-investment.com', phone: '+84 904 567 890' },
    { name: 'Mai Nguyen', title: 'CFO', department: 'Finance', email: 'mai.nguyen@tmz-investment.com', phone: '+84 905 678 901' },
    { name: 'Minh Hoang', title: 'IT Manager', department: 'IT Department', email: 'minh.hoang@tmz-investment.com', phone: '+84 906 789 012' },
];

const StrategyTab: React.FC<StrategyTabProps> = ({ plan }) => {
    const isNew = plan.isNew;
    const [stakeholders, setStakeholders] = useState<Stakeholder[]>(isNew ? [] : INITIAL_MOCK_STAKEHOLDERS);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStakeholderId, setEditingStakeholderId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStakeholderId, setSelectedStakeholderId] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'map' | 'table'>('map');
    
    // Stakeholder Form State
    const [formData, setFormData] = useState<Partial<Stakeholder>>({
        name: '', title: '', role: 'Influencer', influence: 50, interest: 50, sentiment: 'Neutral', department: '', email: '', phone: ''
    });

    const handleSaveStakeholder = () => {
        if (formData.name) {
            if (editingStakeholderId) {
                // Update existing
                setStakeholders(stakeholders.map(s => 
                    s.id === editingStakeholderId 
                    ? { ...s, ...formData } as Stakeholder 
                    : s
                ));
            } else {
                // Add new
                const sh: Stakeholder = {
                    id: Date.now().toString(),
                    name: formData.name!,
                    title: formData.title || '',
                    role: formData.role as any,
                    influence: formData.influence || 50,
                    interest: formData.interest || 50,
                    sentiment: formData.sentiment as any || 'Neutral',
                    department: formData.department,
                    email: formData.email,
                    phone: formData.phone
                };
                setStakeholders([...stakeholders, sh]);
            }
            handleCloseModal();
        }
    };

    const handleProfileSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedName = e.target.value;
        const profile = STAKEHOLDER_PROFILES.find(p => p.name === selectedName);
        
        if (profile) {
            setFormData({
                ...formData,
                name: profile.name,
                title: profile.title,
                department: profile.department,
                email: profile.email,
                phone: profile.phone
            });
        } else {
            setFormData({ ...formData, name: selectedName });
        }
    };

    const handleEditStakeholder = (sh: Stakeholder, e: React.MouseEvent) => {
        e.stopPropagation();
        setEditingStakeholderId(sh.id);
        setFormData({ ...sh });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingStakeholderId(null);
        setFormData({ name: '', title: '', role: 'Influencer', influence: 50, interest: 50, sentiment: 'Neutral', department: '', email: '', phone: '' });
    };

    const handleDeleteStakeholder = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setStakeholders(stakeholders.filter(s => s.id !== id));
        if (selectedStakeholderId === id) setSelectedStakeholderId(null);
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

    const getRoleBadgeStyle = (role: string) => {
        switch(role) {
            case 'Decision Maker': return 'bg-blue-50 text-blue-700 border-blue-100';
            case 'Blocker': return 'bg-red-50 text-red-700 border-red-100';
            case 'Champion': return 'bg-green-50 text-green-700 border-green-100';
            default: return 'bg-slate-50 text-slate-600 border-slate-200';
        }
    };

    const getProgressColor = (val: number) => {
        if (val > 80) return 'bg-green-500';
        if (val >= 50) return 'bg-blue-600';
        if (val >= 30) return 'bg-orange-500';
        return 'bg-red-500';
    };

    const filteredStakeholders = stakeholders.filter(s => 
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        s.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 {/* Stakeholder List */}
                 <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-[700px] lg:col-span-1 overflow-hidden">
                    <div className="p-4 border-b border-slate-200 bg-white space-y-3">
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                <Users size={18} className="text-blue-600" />
                                Stakeholder List
                            </h3>
                            <button 
                                onClick={() => setIsModalOpen(true)} 
                                className="w-8 h-8 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-sm flex items-center justify-center transition-colors"
                            >
                                <Plus size={20} />
                            </button>
                        </div>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                            <input 
                                type="text" 
                                placeholder="Search stakeholder..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 bg-slate-50 text-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            />
                        </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/30">
                        {filteredStakeholders.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400">
                                <p className="text-sm">No stakeholders found</p>
                            </div>
                        ) : (
                            filteredStakeholders.map(person => (
                                <div 
                                    key={person.id} 
                                    onClick={() => setSelectedStakeholderId(person.id === selectedStakeholderId ? null : person.id)}
                                    className={`p-4 rounded-xl border transition-all cursor-pointer relative group shadow-sm bg-white
                                        ${selectedStakeholderId === person.id ? 'border-blue-500 ring-2 ring-blue-50' : 'border-slate-100 hover:border-blue-300'}
                                    `}
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-3">
                                             <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${getSentimentBg(person.sentiment)} transition-transform group-hover:scale-105`}>
                                                 {person.name.charAt(0)}
                                             </div>
                                             <div>
                                                <div className="font-bold text-slate-800 text-sm">{person.name}</div>
                                                <div className="text-xs text-slate-500 font-medium">{person.title}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button 
                                                onClick={(e) => handleEditStakeholder(person, e)}
                                                className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-all opacity-0 group-hover:opacity-100"
                                                title="Edit Stakeholder"
                                            >
                                                <Edit2 size={14} />
                                            </button>
                                            <div className={`w-2.5 h-2.5 rounded-full ${getSentimentColor(person.sentiment)} shadow-sm`}></div>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-3 flex flex-wrap gap-2 pl-[52px]">
                                        <span className={`px-2.5 py-1 rounded-lg border text-[10px] font-bold uppercase tracking-wider ${getRoleBadgeStyle(person.role)}`}>
                                            {person.role}
                                        </span>
                                        {selectedStakeholderId === person.id && (
                                            <div className="w-full mt-3 pt-3 border-t border-slate-100 space-y-2 animate-in slide-in-from-top-1 duration-200">
                                                <div className="flex items-center gap-2 text-xs text-slate-600">
                                                    <Mail size={12} className="text-slate-400" />
                                                    <span className="truncate">{person.email || 'No email set'}</span>
                                                </div>
                                                {person.phone && (
                                                    <div className="flex items-center gap-2 text-xs text-slate-600">
                                                        <Phone size={12} className="text-slate-400" />
                                                        <span>{person.phone}</span>
                                                    </div>
                                                )}
                                                <div className="flex justify-between items-center text-[10px] text-slate-400 font-medium pt-1">
                                                    <span>Influence: {person.influence}%</span>
                                                    <span>Support: {person.interest}%</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Influence Map / Table View */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm h-[700px] flex flex-col relative">
                     <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white z-20">
                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <Users size={20} className="text-purple-600" />
                            {viewMode === 'map' ? 'Influence Map' : 'Stakeholder Details'}
                        </h3>
                        
                        {/* View Switcher */}
                        <div className="flex bg-slate-100 p-1 rounded-lg">
                            <button 
                                onClick={() => setViewMode('map')}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${viewMode === 'map' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                <LayoutGrid size={14} /> Map
                            </button>
                            <button 
                                onClick={() => setViewMode('table')}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${viewMode === 'table' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                <TableIcon size={14} /> Table
                            </button>
                        </div>
                    </div>
                    
                    {viewMode === 'map' ? (
                        <div className="flex-1 relative pt-10 pb-10 pl-16 pr-6 min-h-0 bg-slate-50/10">
                            {/* Axis Labels */}
                            <div className="absolute top-0 left-16 right-6 flex justify-between text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                                <span className="text-blue-900/40">Low Influence</span>
                                <span className="text-slate-800 text-sm">Influence Level</span>
                                <span className="text-blue-900/40">High Influence</span>
                            </div>
                            
                            <div className="absolute top-10 bottom-10 left-0 w-12 flex flex-col justify-between items-center text-[11px] font-bold text-slate-400 py-6">
                                <span className="-rotate-90 whitespace-nowrap text-blue-900/40 uppercase tracking-widest">Supporter</span>
                                <span className="-rotate-90 text-slate-800 text-sm uppercase tracking-widest whitespace-nowrap">Support Level</span>
                                <span className="-rotate-90 whitespace-nowrap text-blue-900/40 uppercase tracking-widest">Blocker</span>
                            </div>

                            {/* Chart Area */}
                            <div className="relative w-full h-full border border-slate-200 rounded-2xl bg-white shadow-inner">
                                {/* Grid Lines */}
                                <div className="absolute top-0 bottom-0 left-1/2 w-px border-l border-dashed border-slate-300"></div>
                                <div className="absolute left-0 right-0 top-1/2 h-px border-t border-dashed border-slate-300"></div>
                                
                                {/* Quadrant Labels */}
                                <div className="absolute top-4 left-4 text-[10px] font-bold text-amber-500 uppercase tracking-widest bg-amber-50/50 px-2 py-1 rounded">Monitor</div>
                                <div className="absolute top-4 right-4 text-[10px] font-bold text-green-600 uppercase tracking-widest bg-green-50/50 px-2 py-1 rounded">Keep Satisfied</div>
                                <div className="absolute bottom-4 left-4 text-[10px] font-bold text-red-500 uppercase tracking-widest bg-red-50/50 px-2 py-1 rounded">Limit Effort</div>
                                <div className="absolute bottom-4 right-4 text-[10px] font-bold text-green-600 uppercase tracking-widest bg-green-50/50 px-2 py-1 rounded">Manage Closely</div>

                                {/* Stakeholders Map Nodes */}
                                {stakeholders.length === 0 ? (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="text-center">
                                            <p className="text-slate-400 text-sm mb-2 font-medium">No stakeholders mapped</p>
                                            <button onClick={() => setIsModalOpen(true)} className="text-blue-600 text-sm font-bold hover:underline flex items-center justify-center gap-1">
                                                <Plus size={16} /> Add First
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    stakeholders.map(s => (
                                        <div 
                                            key={s.id}
                                            className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10 transition-all cursor-pointer group"
                                            style={{ left: `${s.influence}%`, top: `${100 - s.interest}%` }}
                                            onClick={() => setSelectedStakeholderId(s.id === selectedStakeholderId ? null : s.id)}
                                        >
                                            <div className={`flex items-center gap-3 bg-white p-2 rounded-xl shadow-lg border-2 w-48 relative overflow-hidden transition-all group-hover:scale-105 group-hover:z-50
                                                ${selectedStakeholderId === s.id ? 'border-blue-500 ring-4 ring-blue-50' : 'border-slate-100 hover:border-blue-200'}
                                            `}>
                                                {/* Colored Side Bar */}
                                                <div className={`absolute left-0 top-0 bottom-0 w-1 ${getSentimentColor(s.sentiment)}`}></div>
                                                
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ml-1 ${getSentimentBg(s.sentiment)} border border-white`}>
                                                    {s.name.split(' ').map(n => n[0]).join('').substring(0,2)}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="text-xs font-bold text-slate-800 truncate leading-tight">{s.name}</div>
                                                    <div className="text-[10px] text-slate-500 truncate mt-0.5 font-medium">{s.title}</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 overflow-auto bg-white custom-scrollbar">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[11px] tracking-wider border-b border-slate-100 sticky top-0 z-10">
                                    <tr>
                                        <th className="px-6 py-4">Stakeholder</th>
                                        <th className="px-6 py-4">Role</th>
                                        <th className="px-6 py-4">Sentiment</th>
                                        <th className="px-6 py-4">Influence</th>
                                        <th className="px-6 py-4">Support</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {stakeholders.map(s => (
                                        <tr 
                                            key={s.id} 
                                            onClick={() => setSelectedStakeholderId(s.id)}
                                            className={`hover:bg-slate-50 transition-colors cursor-pointer ${selectedStakeholderId === s.id ? 'bg-blue-50/30' : ''}`}
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[10px] ${getSentimentBg(s.sentiment)}`}>
                                                        {s.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-slate-800">{s.name}</div>
                                                        <div className="text-xs text-slate-500">{s.title}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2.5 py-1 rounded-lg border text-[10px] font-bold uppercase tracking-wider ${getRoleBadgeStyle(s.role)}`}>
                                                    {s.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-2 h-2 rounded-full ${getSentimentColor(s.sentiment)}`}></div>
                                                    <span className="text-xs font-medium text-slate-700">{s.sentiment}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex-1 h-1.5 min-w-[60px] bg-slate-100 rounded-full overflow-hidden">
                                                        <div className={`h-full rounded-full transition-all duration-500 ${getProgressColor(s.influence)}`} style={{ width: `${s.influence}%` }}></div>
                                                    </div>
                                                    <span className="text-xs font-bold text-slate-600">{s.influence}%</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex-1 h-1.5 min-w-[60px] bg-slate-100 rounded-full overflow-hidden">
                                                        <div className={`h-full rounded-full transition-all duration-500 ${getProgressColor(s.interest)}`} style={{ width: `${s.interest}%` }}></div>
                                                    </div>
                                                    <span className="text-xs font-bold text-slate-600">{s.interest}%</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-1">
                                                    <button 
                                                        onClick={(e) => handleEditStakeholder(s, e)}
                                                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-all"
                                                        title="Chỉnh sửa Stakeholder"
                                                    >
                                                        <Edit2 size={14} />
                                                    </button>
                                                    <button 
                                                        onClick={(e) => handleDeleteStakeholder(s.id, e)}
                                                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-all"
                                                        title="Xóa Stakeholder"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Stakeholder Modal - Updated structure with single column layout for major info */}
            <Modal 
                isOpen={isModalOpen} 
                onClose={handleCloseModal} 
                title={editingStakeholderId ? "Cập nhật Stakeholder" : "Add Stakeholder"}
            >
                <div className="space-y-5">
                    {/* Row 1: Full Name - Spans full width */}
                    <div className="space-y-1.5">
                        <label className="text-[13px] font-semibold text-slate-700">Full Name</label>
                        <div className="relative">
                            <select 
                                value={formData.name} 
                                onChange={handleProfileSelect} 
                                className="w-full px-3 py-2.5 border border-slate-200 bg-white text-slate-900 rounded-lg outline-none text-sm appearance-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                            >
                                <option value="">Chọn hồ sơ...</option>
                                {STAKEHOLDER_PROFILES.map((p, idx) => (
                                    <option key={idx} value={p.name}>{p.name}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                        </div>
                    </div>

                    {/* Row 2: Job Title - Spans full width */}
                    <div className="space-y-1.5">
                        <label className="text-[13px] font-semibold text-slate-700">Job Title</label>
                        <input 
                            type="text" 
                            value={formData.title} 
                            onChange={e => setFormData({...formData, title: e.target.value})} 
                            className="w-full px-3 py-2.5 border border-slate-200 bg-white text-slate-900 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm shadow-sm" 
                            placeholder="e.g. CEO" 
                        />
                    </div>
                    
                    {/* Row 3: Department - Spans full width */}
                    <div className="space-y-1.5">
                        <label className="text-[13px] font-semibold text-slate-700">Department</label>
                        <div className="relative">
                            <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                            <input 
                                type="text" 
                                value={formData.department} 
                                onChange={e => setFormData({...formData, department: e.target.value})} 
                                className="w-full pl-9 pr-3 py-2.5 border border-slate-200 bg-white text-slate-900 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm shadow-sm" 
                                placeholder="Executive" 
                            />
                        </div>
                    </div>

                    {/* Row 4: Email & Phone - Shared line (2 cols) */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[13px] font-semibold text-slate-700">Email</label>
                            <input 
                                type="email" 
                                value={formData.email} 
                                onChange={e => setFormData({...formData, email: e.target.value})} 
                                className="w-full px-3 py-2.5 border border-slate-200 bg-white text-slate-900 rounded-lg outline-none text-sm shadow-sm" 
                                placeholder="email@company.com" 
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[13px] font-semibold text-slate-700">Phone</label>
                            <input 
                                type="text" 
                                value={formData.phone} 
                                onChange={e => setFormData({...formData, phone: e.target.value})} 
                                className="w-full px-3 py-2.5 border border-slate-200 bg-white text-slate-900 rounded-lg outline-none text-sm shadow-sm" 
                                placeholder="+84 ..." 
                            />
                        </div>
                    </div>

                    {/* Row 5: Classification (Role) - Spans full width */}
                    <div className="space-y-1.5">
                        <label className="text-[13px] font-semibold text-slate-700">Classification (Role)</label>
                        <select 
                            value={formData.role} 
                            onChange={e => setFormData({...formData, role: e.target.value as any})} 
                            className="w-full px-3 py-2.5 border border-slate-200 bg-white text-slate-900 rounded-lg outline-none text-sm font-medium shadow-sm"
                        >
                            <option value="Decision Maker">Decision Maker</option>
                            <option value="Influencer">Influencer</option>
                            <option value="Champion">Champion</option>
                            <option value="Blocker">Blocker</option>
                            <option value="User">User</option>
                        </select>
                    </div>

                    {/* Row 6: Influence & Support sliders */}
                    <div className="grid grid-cols-2 gap-6 pt-2">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Influence (X: 0-100)</label>
                            <input type="range" min="0" max="100" value={formData.influence} onChange={e => setFormData({...formData, influence: parseInt(e.target.value)})} className="w-full accent-blue-600" />
                            <div className="flex justify-between text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                                <span>Low</span>
                                <span className="text-blue-600 bg-blue-50 px-2 rounded-full">{formData.influence}%</span>
                                <span>High</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Support Level (Y: 0-100)</label>
                            <input type="range" min="0" max="100" value={formData.interest} onChange={e => setFormData({...formData, interest: parseInt(e.target.value)})} className="w-full accent-blue-600" />
                            <div className="flex justify-between text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                                <span>Blocker</span>
                                <span className="text-blue-600 bg-blue-50 px-2 rounded-full">{formData.interest}%</span>
                                <span>Supporter</span>
                            </div>
                        </div>
                    </div>

                    {/* Row 7: Sentiment */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Current Relationship Sentiment</label>
                        <div className="flex gap-4">
                            {['Positive', 'Neutral', 'Negative'].map((s) => (
                                <label key={s} className="flex items-center gap-2 cursor-pointer bg-slate-50 px-4 py-2 rounded-lg border border-slate-100 hover:border-blue-200 transition-colors">
                                    <input 
                                        type="radio" 
                                        name="sentiment" 
                                        value={s} 
                                        checked={formData.sentiment === s} 
                                        onChange={() => setFormData({...formData, sentiment: s as any})}
                                        className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className={`text-sm font-bold ${s === 'Positive' ? 'text-green-600' : s === 'Negative' ? 'text-red-600' : 'text-slate-600'}`}>{s}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="pt-6 flex justify-end gap-3 border-t border-slate-100">
                        <button 
                            onClick={handleCloseModal} 
                            className="px-6 py-2.5 text-slate-600 hover:bg-slate-100 rounded-lg font-bold text-sm transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleSaveStakeholder} 
                            className="px-8 py-2.5 bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-bold text-sm shadow-md shadow-blue-100 transition-all active:scale-95 flex items-center gap-2"
                        >
                            {editingStakeholderId ? <Save size={18} /> : null}
                            {editingStakeholderId ? "Cập nhật" : "Save Stakeholder"}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default StrategyTab;
