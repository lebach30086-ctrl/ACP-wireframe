import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
    Download, 
    BarChart3, 
    Plus, 
    Edit2, 
    AlertTriangle, 
    TrendingUp, 
    Search, 
    Swords, 
    Trash2, 
    Globe, 
    Save, 
    X, 
    Lightbulb, 
    PlusCircle, 
    Bold, 
    Italic, 
    List, 
    ListOrdered, 
    Link, 
    Underline, 
    AlignLeft, 
    AlignCenter, 
    AlignRight,
    FileText,
    FileSpreadsheet,
    File,
    UploadCloud,
    Paperclip,
    ExternalLink,
    Sparkles,
    Bot,
    RefreshCw,
    Copy,
    ShieldAlert,
    CheckCircle2,
    Hourglass,
    XCircle,
    PlusCircle as PlusCircleIcon,
    DollarSign,
    Briefcase,
    Package,
    ChevronRight,
    Info,
    Edit3,
    ChevronDown
} from 'lucide-react';
import { AccountPlan } from '../../types';
import Modal from '../ui/Modal';

interface MarketTabProps {
    plan: AccountPlan;
    visibleSections?: Record<string, boolean>;
}

// ... (Rest of interfaces and constants remain the same)
// --- Types & Constants for Risk/Competitor ---
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

interface IndustryMetric {
    id: string;
    label: string;
    value: string;
}

interface AttachedFile {
    id: string;
    name: string;
    type: string;
    size: string;
}

interface IndustryData {
    industry: string;
    metrics: IndustryMetric[];
    insights: string;
    files: AttachedFile[];
}

// --- Types & Constants for Whitespace ---
type CellStatus = 'Owned' | 'Pipeline' | 'Whitespace' | 'Competitor';

interface CellData {
    status: CellStatus;
    propensityScore?: number;
    estimatedValue?: number;
    recommendation?: string;
    opportunityStage?: string;
    competitorName?: string;
    productId?: string;
    productName?: string;
}

interface MatrixRow {
    id: string;
    name: string;
    cells: Record<string, CellData>;
}

const PRODUCT_CATEGORIES = [
    { id: 'p1', name: 'Working Capital', category: 'Credit' },
    { id: 'p2', name: 'Term Loan', category: 'Credit' },
    { id: 'p3', name: 'Payroll', category: 'Deposit' },
    { id: 'p4', name: 'FX Trading', category: 'Global Markets' },
    { id: 'p5', name: 'Trade Finance', category: 'Trade' },
    { id: 'p6', name: 'Cyber Insurance', category: 'Insurance' },
];

const DETAILED_PRODUCTS = [
    { id: 'dp1', name: 'Vay thấu chi doanh nghiệp', category: 'Credit', parentCategoryId: 'p1' },
    { id: 'dp2', name: 'Tín dụng xanh 2024', category: 'Credit', parentCategoryId: 'p2' },
    { id: 'dp3', name: 'Payroll Smart 2.0', category: 'Deposit', parentCategoryId: 'p3' },
    { id: 'dp4', name: 'FX Spot & Forward', category: 'Global Markets', parentCategoryId: 'p4' },
    { id: 'dp5', name: 'L/C nhập khẩu ưu đãi', category: 'Trade', parentCategoryId: 'p5' },
    { id: 'dp6', name: 'Bảo hiểm rủi ro mạng (Cyber)', category: 'Insurance', parentCategoryId: 'p6' },
    { id: 'dp7', name: 'Vay tín chấp tiểu thương', category: 'Credit', parentCategoryId: 'p1' },
    { id: 'dp8', name: 'Gói ưu đãi trả lương Mobio', category: 'Deposit', parentCategoryId: 'p3' },
];

const ENTITIES = [
    { id: 'e1', name: 'Headquarters (HCM)' },
    { id: 'e2', name: 'Branch Hanoi' },
    { id: 'e3', name: 'Logistics Subsidiary' },
    { id: 'e4', name: 'Tech Division' },
];

const generateMockMatrix = (): MatrixRow[] => [
    {
        id: 'e1',
        name: 'Headquarters (HCM)',
        cells: {
            'p1': { status: 'Owned', productId: 'dp1', productName: 'Vay thấu chi doanh nghiệp' },
            'p2': { status: 'Owned', productId: 'dp2', productName: 'Tín dụng xanh 2024' },
            'p3': { status: 'Pipeline', opportunityStage: 'Negotiation' },
            'p4': { status: 'Owned', productId: 'dp4', productName: 'FX Spot & Forward' },
            'p5': { status: 'Whitespace', propensityScore: 85, estimatedValue: 500000, recommendation: 'High import volume detected in recent financial reports.' },
            'p6': { status: 'Competitor', competitorName: 'AIG' },
        }
    },
    {
        id: 'e2',
        name: 'Branch Hanoi',
        cells: {
            'p1': { status: 'Owned', productId: 'dp1', productName: 'Vay thấu chi doanh nghiệp' },
            'p2': { status: 'Whitespace', propensityScore: 65, estimatedValue: 200000, recommendation: 'Expansion plans announced for Northern region.' },
            'p3': { status: 'Owned', productId: 'dp3', productName: 'Payroll Smart 2.0' },
            'p4': { status: 'Whitespace', propensityScore: 40, estimatedValue: 50000, recommendation: 'Occasional cross-border payments.' },
            'p5': { status: 'Whitespace', propensityScore: 78, estimatedValue: 150000, recommendation: 'Supply chain financing opportunity.' },
            'p6': { status: 'Whitespace', propensityScore: 30, estimatedValue: 20000, recommendation: 'Low priority.' },
        }
    },
    {
        id: 'e3',
        name: 'Logistics Subsidiary',
        cells: {
            'p1': { status: 'Competitor', competitorName: 'Vietcombank' },
            'p2': { status: 'Competitor', competitorName: 'Vietcombank' },
            'p3': { status: 'Whitespace', propensityScore: 92, estimatedValue: 300000, recommendation: 'Large workforce, currently using manual payroll.' },
            'p4': { status: 'Whitespace', propensityScore: 20, estimatedValue: 10000, recommendation: 'Domestic focus.' },
            'p5': { status: 'Pipeline', opportunityStage: 'Discovery' },
            'p6': { status: 'Whitespace', propensityScore: 60, estimatedValue: 40000, recommendation: 'Growing digital footprint.' },
        }
    },
    {
        id: 'e4',
        name: 'Tech Division',
        cells: {
            'p1': { status: 'Whitespace', propensityScore: 70, estimatedValue: 100000, recommendation: 'R&D funding needs.' },
            'p2': { status: 'Whitespace', propensityScore: 50, estimatedValue: 50000, recommendation: 'Moderate need.' },
            'p3': { status: 'Owned', productId: 'dp3', productName: 'Payroll Smart 2.0' },
            'p4': { status: 'Owned', productId: 'dp4', productName: 'FX Spot & Forward' },
            'p5': { status: 'Whitespace', propensityScore: 10, estimatedValue: 0, recommendation: 'Service based, low trade need.' },
            'p6': { status: 'Owned', productId: 'dp6', productName: 'Bảo hiểm rủi ro mạng (Cyber)' },
        }
    }
];

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

const MarketTab: React.FC<MarketTabProps> = ({ plan, visibleSections }) => {
    const isNew = plan.isNew;
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    // ... (State declarations remain the same)
    // --- Basic Strategic States ---
    const [competitors, setCompetitors] = useState<Competitor[]>(isNew ? [] : INITIAL_MOCK_COMPETITORS);
    const [isCompModalOpen, setIsCompModalOpen] = useState(false);
    const [isSwotModalOpen, setIsSwotModalOpen] = useState(false);
    const [isIndustryModalOpen, setIsIndustryModalOpen] = useState(false);
    const [editingCompetitorId, setEditingCompetitorId] = useState<string | null>(null);
    const [isAiPanelOpen, setIsAiPanelOpen] = useState(false);
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [aiData, setAiData] = useState<{metrics: IndustryMetric[], insights: string} | null>(null);
    const [isRiskModalOpen, setIsRiskModalOpen] = useState(false);
    const [editingRiskId, setEditingRiskId] = useState<string | null>(null);
    const [riskFormData, setRiskFormData] = useState<Partial<Risk>>({ risk: '', impact: 'Medium', prob: 'Medium', mitigation: '' });
    const [industryData, setIndustryData] = useState<IndustryData>({
        industry: isNew ? '' : 'Manufacturing & Supply Chain',
        metrics: isNew ? [] : [
            { id: 'm1', label: 'AVG MARGIN', value: '12.5%' },
            { id: 'm2', label: 'YOY GROWTH', value: '+4.2%' },
            { id: 'm3', label: 'REVENUE', value: '10%' }
        ],
        insights: isNew ? '' : 'Shift towards AI-driven inventory management.\nIncreased focus on sustainable manufacturing processes.\nConsolidation of smaller logistics providers.',
        files: [
            { id: 'f1', name: 'Q4_Industry_Report.pdf', type: 'application/pdf', size: '2.4 MB' },
            { id: 'f2', name: 'Competitor_Landscape_Analysis.xlsx', type: 'application/vnd.ms-excel', size: '1.1 MB' }
        ]
    });
    const [industryEdit, setIndustryEdit] = useState<IndustryData>({ ...industryData });
    const [swot, setSwot] = useState({
        strengths: ['Market Leader in APAC', 'Strong R&D capabilities'],
        weaknesses: ['Legacy IT systems', 'High operational costs'],
        opportunities: ['Digital transformation demand', 'Cloud migration'],
        threats: ['Aggressive startups', 'Regulatory changes']
    });
    const [swotEdit, setSwotEdit] = useState({ 
        strengths: swot.strengths.join('. '), 
        weaknesses: swot.weaknesses.join('. '), 
        opportunities: swot.opportunities.join('. '), 
        threats: swot.threats.join('. ') 
    });
    const [risks, setRisks] = useState<Risk[]>([
        { id: '1', risk: 'Budget Cuts', impact: 'High', prob: 'Medium', mitigation: 'Focus on ROI-driven solutions' },
        { id: '2', risk: 'Competitor Entry', impact: 'Medium', prob: 'High', mitigation: 'Lock in multi-year contracts' },
        { id: '3', risk: 'Technical Debt', impact: 'High', prob: 'High', mitigation: 'Propose phased modernization' }
    ]);
    const [compFormData, setCompFormData] = useState<Partial<Competitor>>({ name: '', website: '', threatLevel: 'Medium', strengths: '', weaknesses: '', differentiatingFactors: '' });

    // --- Whitespace States ---
    const [matrix, setMatrix] = useState<MatrixRow[]>(isNew ? [] : generateMockMatrix());
    const [hoveredCell, setHoveredCell] = useState<{ rowId: string, prodId: string, rect: DOMRect } | null>(null);
    const [isOppModalOpen, setIsOppModalOpen] = useState(false);
    const [isProductSelectModalOpen, setIsProductSelectModalOpen] = useState(false);
    const [isProductPickerOpen, setIsProductPickerOpen] = useState(false);
    const [selectedCellInfo, setSelectedCellInfo] = useState<{ rowId: string, prodId: string, data: CellData } | null>(null);
    const [oppForm, setOppForm] = useState({ name: '', amount: '', stage: 'Qualification', closeDate: '', categoryId: '', categoryName: '', detailedProductId: '', detailedProductName: '' });
    const [productSearch, setProductSearch] = useState('');

    // ... (Handlers)
    // --- Basic Handlers ---
    const getFileIcon = (fileName: string) => {
        const ext = fileName.split('.').pop()?.toLowerCase();
        if (ext === 'pdf') return <FileText className="text-red-500" size={18} />;
        if (['doc', 'docx'].includes(ext || '')) return <File className="text-blue-500" size={18} />;
        if (['xls', 'xlsx', 'csv'].includes(ext || '')) return <FileSpreadsheet className="text-green-500" size={18} />;
        return <File className="text-slate-400" size={18} />;
    };

    const getThreatColor = (level: string) => {
        switch(level) {
            case 'High': return 'bg-red-100 text-red-700 border-red-200';
            case 'Medium': return 'bg-orange-100 text-orange-700 border-orange-200';
            case 'Low': return 'bg-green-100 text-green-700 border-green-200';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    const handleSaveIndustry = () => { setIndustryData({ ...industryEdit }); setIsIndustryModalOpen(false); };
    const handleAddMetric = () => setIndustryEdit({ ...industryEdit, metrics: [...industryEdit.metrics, { id: Date.now().toString(), label: 'NEW METRIC', value: '-' }] });
    const handleUpdateMetric = (id: string, field: keyof IndustryMetric, val: string) => setIndustryEdit({ ...industryEdit, metrics: industryEdit.metrics.map(m => m.id === id ? { ...m, [field]: val } : m) });
    const handleDeleteMetric = (id: string) => setIndustryEdit({ ...industryEdit, metrics: industryEdit.metrics.filter(m => m.id !== id) });
    const handleSaveSwot = () => {
        setSwot({
            strengths: swotEdit.strengths.split('. ').filter(s => s.trim()),
            weaknesses: swotEdit.weaknesses.split('. ').filter(s => s.trim()),
            opportunities: swotEdit.opportunities.split('. ').filter(s => s.trim()),
            threats: swotEdit.threats.split('. ').filter(s => s.trim()),
        });
        setIsSwotModalOpen(false);
    };

    const handleAddRisk = () => {
        if (riskFormData.risk) {
            if (editingRiskId) setRisks(risks.map(r => r.id === editingRiskId ? { ...r, ...riskFormData } as Risk : r));
            else setRisks([...risks, { ...riskFormData, id: Date.now().toString() } as Risk]);
            setIsRiskModalOpen(false); setEditingRiskId(null); setRiskFormData({ risk: '', impact: 'Medium', prob: 'Medium', mitigation: '' });
        }
    };
    const handleEditRisk = (risk: Risk) => { setEditingRiskId(risk.id); setRiskFormData({ ...risk }); setIsRiskModalOpen(true); };
    const handleDeleteRisk = (id: string) => { setRisks(risks.filter(r => r.id !== id)); setIsRiskModalOpen(false); };

    const handleAddCompetitor = () => {
        if (compFormData.name) {
            if (editingCompetitorId) setCompetitors(competitors.map(c => c.id === editingCompetitorId ? { ...c, ...compFormData } as Competitor : c));
            else setCompetitors([...competitors, { ...compFormData, id: Date.now().toString() } as Competitor]);
            setIsCompModalOpen(false); setEditingCompetitorId(null); setCompFormData({ name: '', website: '', threatLevel: 'Medium', strengths: '', weaknesses: '', differentiatingFactors: '' });
        }
    };
    const handleEditCompetitor = (comp: Competitor) => { setEditingCompetitorId(comp.id); setCompFormData({ ...comp }); setIsCompModalOpen(true); };
    const handleDeleteCompetitor = (id: string) => setCompetitors(competitors.filter(c => c.id !== id));

    // --- Whitespace Handlers ---
    const handleCellClick = (rowId: string, prodId: string, cell: CellData) => {
        setSelectedCellInfo({ rowId, prodId, data: cell });
        if (cell.status === 'Whitespace') {
            const category = PRODUCT_CATEGORIES.find(p => p.id === prodId);
            const entityName = ENTITIES.find(e => e.id === rowId)?.name;
            const suggestedProduct = DETAILED_PRODUCTS.find(dp => dp.parentCategoryId === prodId);
            setOppForm({
                name: `Opportunity: ${suggestedProduct?.name || category?.name} - ${entityName}`,
                amount: cell.estimatedValue ? cell.estimatedValue.toString() : '',
                stage: 'Qualification',
                closeDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
                categoryId: prodId,
                categoryName: category?.name || '',
                detailedProductId: suggestedProduct?.id || '',
                detailedProductName: suggestedProduct?.name || ''
            });
            setIsOppModalOpen(true);
        } else if (cell.status === 'Owned') {
            setIsProductSelectModalOpen(true);
        }
    };

    const handleSelectProduct = (detailedProd: typeof DETAILED_PRODUCTS[0]) => {
        if (!selectedCellInfo) return;
        setMatrix(prev => prev.map(row => row.id === selectedCellInfo.rowId ? { ...row, cells: { ...row.cells, [selectedCellInfo.prodId]: { ...row.cells[selectedCellInfo.prodId], productId: detailedProd.id, productName: detailedProd.name } } } : row));
        setIsProductSelectModalOpen(false); setProductSearch('');
    };

    const handlePickProductForOpp = (prod: typeof DETAILED_PRODUCTS[0]) => {
        const entityName = ENTITIES.find(e => e.id === selectedCellInfo?.rowId)?.name;
        setOppForm(prev => ({ ...prev, detailedProductId: prod.id, detailedProductName: prod.name, name: `Opportunity: ${prod.name} - ${entityName}` }));
        setIsProductPickerOpen(false);
    };

    const renderCellContent = (cell: CellData) => {
        switch (cell.status) {
            case 'Owned': return (
                <div className="flex flex-col items-center gap-1 group">
                    <div className="bg-green-100 text-green-700 p-1.5 rounded-full shadow-sm group-hover:scale-110 transition-transform"><CheckCircle2 size={18} strokeWidth={2.5} /></div>
                    <div className="max-w-[110px] truncate"><span className="text-[10px] font-bold text-slate-700 leading-none">{cell.productName || 'Chưa định danh'}</span></div>
                    <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"><Edit3 size={10} className="text-slate-400" /></div>
                </div>
            );
            case 'Pipeline': return (
                <div className="flex flex-col items-center gap-1">
                    <div className="bg-blue-100 text-blue-600 p-1.5 rounded-full"><Hourglass size={18} className="animate-pulse" /></div>
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-tighter">{cell.opportunityStage}</span>
                </div>
            );
            case 'Competitor': return (
                <div className="flex flex-col items-center gap-1">
                    <div className="bg-red-50 text-red-400 p-1.5 rounded-full border border-red-100"><XCircle size={18} /></div>
                    <span className="text-[10px] font-bold text-red-400 truncate max-w-[100px]">{cell.competitorName}</span>
                </div>
            );
            case 'Whitespace': return (
                <div className="flex flex-col items-center gap-1 group-hover:scale-110 transition-transform">
                    <PlusCircleIcon className="text-slate-300 group-hover:text-blue-600" size={24} />
                    {cell.propensityScore && cell.propensityScore > 75 && <span className="absolute top-2 right-2 flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span></span>}
                </div>
            );
            default: return null;
        }
    };

    const isVisible = (sectionId: string) => {
        if (!visibleSections) return true;
        return visibleSections[sectionId] !== false;
    };

    return (
        <div className="space-y-6">
            {/* 1. Industry & Market */}
            {isVisible('industry') && (
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative group">
                    <div className="absolute top-6 right-6 flex items-center gap-2">
                         <button onClick={() => { setIsAiPanelOpen(true); if(!aiData) { setIsAiLoading(true); setTimeout(() => { setAiData({ metrics: [{ id: 'ai-1', label: 'AVG MARGIN', value: '14.5%' }, { id: 'ai-2', label: 'YOY GROWTH', value: '+6.8%' }, { id: 'ai-3', label: 'DIGITAL ADOPTION', value: 'High' }], insights: "• **Market Trend**: Rapid shift towards AI-driven inventory optimization and autonomous supply chain systems.\n• **Regulatory**: New sustainability compliance standards (ESG) affecting manufacturing costs.\n• **Competitor Move**: Major players are consolidating smaller logistics providers to increase market share." }); setIsAiLoading(false); }, 1500); } }} className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border border-indigo-200 rounded-lg text-xs font-bold transition-all shadow-sm"><Sparkles size={14} /> AI Research</button>
                        <button onClick={() => { setIndustryEdit({...industryData}); setIsIndustryModalOpen(true); }} className={`p-1.5 rounded transition-colors ${isNew ? 'bg-blue-600 text-white opacity-100 shadow-sm' : 'text-slate-400 hover:bg-slate-50 hover:text-blue-600 border border-transparent hover:border-slate-200'}`} title="Edit Manually">{isNew ? <Plus size={16} /> : <Edit2 size={16} />}</button>
                    </div>
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><TrendingUp size={20} className="text-blue-600" /> Industry & Market Analysis</h3>
                            <p className="text-sm text-slate-500">{industryData.industry || 'No industry data'}</p>
                        </div>
                    </div>
                    {isAiPanelOpen && (
                        <div className="mb-8 rounded-xl overflow-hidden border border-blue-100 bg-white shadow-sm animate-in slide-in-from-top-2 ring-1 ring-blue-100">
                            <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 px-4 py-3 border-b border-blue-100 flex justify-between items-center">
                                 <div className="flex items-center gap-3"><div className="p-1.5 bg-white rounded-lg shadow-sm text-blue-600 border border-blue-100"><Bot size={18} /></div><div><span className="text-sm font-bold text-slate-800 block">AI Market Intelligence Layer</span><span className="text-[11px] text-slate-500 font-medium">Automated market scanning & trends analysis</span></div></div>
                                 <div className="flex items-center gap-2">{isAiLoading && <div className="flex items-center gap-2 text-xs font-bold text-blue-600 mr-2"><RefreshCw size={12} className="animate-spin" /> Analyzing...</div>}<button onClick={() => setIsAiPanelOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 hover:bg-white/50 rounded-lg transition-colors"><X size={18} /></button></div>
                            </div>
                            <div className="p-5">
                                {isAiLoading ? <div className="space-y-4"><div className="flex gap-4"><div className="h-24 w-32 bg-slate-50 rounded-xl animate-pulse border border-slate-100"></div><div className="h-24 w-32 bg-slate-50 rounded-xl animate-pulse border border-slate-100"></div><div className="h-24 w-32 bg-slate-50 rounded-xl animate-pulse border border-slate-100"></div></div><div className="h-28 w-full bg-slate-50 rounded-xl animate-pulse border border-slate-100"></div></div> : aiData ? (
                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                                        <div className="md:col-span-4"><h4 className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-3 flex items-center gap-2"><Sparkles size={12} /> Suggested Metrics</h4><div className="space-y-2">{aiData.metrics.map(m => (<div key={m.id} className="p-3 bg-slate-50/50 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-sm transition-all flex justify-between items-center group/metric cursor-pointer"><div><div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{m.label}</div><div className="text-xl font-black text-slate-800 mt-0.5">{m.value}</div></div><button onClick={() => { const exIdx = industryData.metrics.findIndex(em => em.label === m.label); let nm = [...industryData.metrics]; if(exIdx >= 0) nm[exIdx] = {...nm[exIdx], value: m.value}; else nm.push({...m, id: Date.now().toString()}); setIndustryData(prev => ({...prev, metrics: nm})); }} className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-blue-600 opacity-0 group-hover/metric:opacity-100 transition-all shadow-sm hover:bg-blue-50" title="Apply metric"><Plus size={16} /></button></div>))}</div></div>
                                        <div className="md:col-span-8"><div className="flex justify-between items-center mb-3"><h4 className="text-[10px] font-black text-blue-500 uppercase tracking-widest flex items-center gap-2"><Sparkles size={12} /> Market Trends & Insights</h4><button onClick={() => setIndustryData(prev => ({...prev, insights: (prev.insights ? prev.insights + '\n\n' : '') + aiData.insights}))} className="flex items-center gap-1.5 text-[11px] font-bold text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors border border-transparent hover:border-blue-100"><Copy size={14} /> Copy to My Plan</button></div><div className="p-5 bg-slate-50/50 rounded-xl border border-slate-200 text-sm text-slate-600 leading-relaxed shadow-sm whitespace-pre-wrap font-medium">{aiData.insights}</div></div>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    )}
                    {isNew && !industryData.industry ? <div className="flex flex-col items-center justify-center text-slate-400 min-h-[150px] border-2 border-dashed border-slate-100 rounded-xl"><div className="bg-slate-50 p-4 rounded-full mb-3"><BarChart3 size={32} /></div><p className="text-sm font-medium">Industry data is missing</p></div> : (
                        <div className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                                <div className="md:col-span-5 grid grid-cols-2 gap-3">{industryData.metrics.map((m) => (<div key={m.id} className="p-4 bg-slate-50 rounded-lg border border-slate-100"><div className="text-[10px] text-slate-800 font-black uppercase mb-1 tracking-widest">{m.label}</div><div className="text-2xl font-black text-slate-900">{m.value}</div></div>))}</div>
                                <div className="md:col-span-7 space-y-3"><h4 className="font-bold text-slate-400 text-[11px] uppercase tracking-widest flex items-center gap-2"><Lightbulb size={14} className="text-blue-500" /> INSIGHTS (User Analysis)</h4><div className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap font-medium">{industryData.insights}</div></div>
                            </div>
                            {industryData.files.length > 0 && <div className="pt-6 border-t border-slate-100"><h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><Paperclip size={12} /> Supporting Documents ({industryData.files.length})</h4><div className="flex flex-wrap gap-4">{industryData.files.map(file => (<div key={file.id} className="flex items-center gap-4 px-4 py-3 bg-white border border-slate-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group/file"><div className="p-2 bg-slate-50 rounded-lg group-hover/file:bg-blue-50 transition-colors">{getFileIcon(file.name)}</div><div className="flex flex-col min-w-0 pr-4"><span className="text-sm font-bold text-slate-800 truncate max-w-[180px]">{file.name}</span><span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter mt-0.5">{file.size}</span></div><div className="flex gap-1.5 ml-auto"><button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all" title="Download"><Download size={16} /></button><button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all" title="View"><ExternalLink size={16} /></button></div></div>))}</div></div>}
                        </div>
                    )}
                </div>
            )}

            {/* 2. SWOT Matrix */}
            {isVisible('swot') && (
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><Search size={20} className="text-purple-600" /> SWOT Matrix</h3>
                        <button onClick={() => { setSwotEdit({ strengths: swot.strengths.join('. '), weaknesses: swot.weaknesses.join('. '), opportunities: swot.opportunities.join('. '), threats: swot.threats.join('. ') }); setIsSwotModalOpen(true); }} className="text-xs text-blue-600 font-bold hover:underline">Edit SWOT</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                        <div className="bg-green-50 border border-green-100 p-4 rounded-xl"><span className="font-black text-green-700 block mb-2 uppercase tracking-widest">STRENGTHS</span><ul className="space-y-1.5 text-green-900 list-none font-medium">{swot.strengths.map((s, i) => (<li key={i} className="flex gap-2"><span className="text-green-500">•</span> {s}</li>))}</ul></div>
                        <div className="bg-red-50 border border-red-100 p-4 rounded-xl"><span className="font-black text-red-700 block mb-2 uppercase tracking-widest">WEAKNESSES</span><ul className="space-y-1.5 text-red-900 list-none font-medium">{swot.weaknesses.map((s, i) => (<li key={i} className="flex gap-2"><span className="text-green-500">•</span> {s}</li>))}</ul></div>
                        <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl"><span className="font-black text-blue-700 block mb-2 uppercase tracking-widest">OPPORTUNITIES</span><ul className="space-y-1.5 text-blue-900 list-none font-medium">{swot.opportunities.map((s, i) => (<li key={i} className="flex gap-2"><span className="text-blue-500">•</span> {s}</li>))}</ul></div>
                        <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl"><span className="font-black text-orange-700 block mb-2 uppercase tracking-widest">THREATS</span><ul className="space-y-1.5 text-orange-900 list-none font-medium">{swot.threats.map((s, i) => (<li key={i} className="flex gap-2"><span className="text-orange-500">•</span> {s}</li>))}</ul></div>
                    </div>
                </div>
            )}

            {/* 3. Combined Strategic Landscape: Risks & Competitors */}
            {isVisible('risk_competitor') && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50/30">
                        <div>
                            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><ShieldAlert size={22} className="text-red-600" /> Risk & Competitive Landscape</h3>
                            <p className="text-xs text-slate-500 font-medium">Unified management of account challenges and rival movements</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-12">
                        <div className="lg:col-span-4 p-6 border-r border-slate-100 bg-slate-50/10">
                            <div className="flex justify-between items-center mb-6">
                                <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><AlertTriangle size={14} className="text-orange-500" /> Risks & Challenges</h4>
                                <button onClick={() => { setEditingRiskId(null); setRiskFormData({ risk: '', impact: 'Medium', prob: 'Medium', mitigation: '' }); setIsRiskModalOpen(true); }} className="text-blue-600 hover:bg-blue-50 p-1.5 rounded-lg transition-all"><Plus size={18} /></button>
                            </div>
                            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                                 {risks.map((item) => (<div key={item.id} onClick={() => handleEditRisk(item)} className="p-4 border border-slate-200 rounded-xl transition-all bg-white hover:shadow-md cursor-pointer group/risk"><div className="flex justify-between items-start mb-2"><span className="font-bold text-slate-800 text-sm">{item.risk}</span><span className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wide border ${item.impact === 'High' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-orange-50 text-orange-600 border-orange-100'}`}>{item.impact}</span></div><div className="text-[11px] bg-slate-50/80 p-2 rounded-lg text-slate-700 border border-slate-100 italic leading-relaxed group-hover/risk:bg-blue-50/30 group-hover/risk:border-blue-100 transition-colors">{item.mitigation}</div></div>))}
                            </div>
                        </div>
                        <div className="lg:col-span-8 p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Swords size={14} className="text-red-500" /> Competitor Analysis</h4>
                                <button onClick={() => { setEditingCompetitorId(null); setCompFormData({ name: '', website: '', threatLevel: 'Medium', strengths: '', weaknesses: '', differentiatingFactors: '' }); setIsCompModalOpen(true); }} className="text-blue-600 hover:bg-blue-50 p-1.5 rounded-lg transition-all"><Plus size={18} /></button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-slate-50/50 text-slate-500 font-bold text-[10px] uppercase tracking-wider border-b border-slate-100">
                                        <tr><th className="px-4 py-3">COMPETITOR</th><th className="px-4 py-3">THREAT</th><th className="px-4 py-3">USP / DIFFERENTIATION</th><th className="px-4 py-3 text-right"></th></tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {competitors.map((comp) => (
                                            <tr key={comp.id} className="hover:bg-slate-50/50 transition-colors group">
                                                <td className="px-4 py-4 align-top"><div className="font-bold text-slate-800 text-sm">{comp.name}</div>{comp.website && <a href={comp.website} target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-600 hover:underline flex items-center gap-1 mt-0.5 font-medium"><Globe size={8} /> Visit</a>}</td>
                                                <td className="px-4 py-4 align-top"><span className={`px-2 py-0.5 rounded-full text-[9px] font-black border ${getThreatColor(comp.threatLevel)}`}>{comp.threatLevel}</span></td>
                                                <td className="px-4 py-4 align-top text-slate-600 leading-relaxed text-xs font-medium">{comp.differentiatingFactors || <span className="text-slate-400 italic">Not defined</span>}</td>
                                                <td className="px-4 py-4 align-top text-right"><div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity"><button onClick={() => handleEditCompetitor(comp)} className="text-slate-400 hover:text-blue-600 p-1.5 rounded-full hover:bg-blue-50 transition-all"><Edit2 size={14} /></button><button onClick={() => handleDeleteCompetitor(comp.id)} className="text-slate-400 hover:text-red-600 p-1.5 rounded-full hover:bg-red-50 transition-all"><Trash2 size={14} /></button></div></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 4. White Space Analysis - Integrated directly into this tab */}
            {isVisible('whitespace') && (
                <div className="pt-10 border-t-2 border-slate-100">
                    <div className="bg-gradient-to-br from-indigo-700 via-blue-600 to-blue-500 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden mb-6">
                        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                            <div className="md:col-span-8">
                                <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-xs font-bold mb-4 backdrop-blur-md"><Sparkles size={14} className="text-yellow-300" /> AI ECOSYSTEM ANALYSIS</div>
                                <h2 className="text-3xl font-black mb-3 leading-tight tracking-tight">Identify & Convert <br/>Whitespace Opportunities</h2>
                                <p className="text-blue-50/80 text-sm max-w-xl leading-relaxed">Based on account transaction behavior and peer benchmarking, we've prioritized <span className="mx-1 text-white font-black underline decoration-yellow-400 decoration-2 underline-offset-4">3 High Potential</span> opportunities across subsidiaries.</p>
                            </div>
                            <div className="md:col-span-4 flex justify-end"><div className="bg-white/10 p-6 rounded-2xl border border-white/20 backdrop-blur-md text-center"><div className="text-[10px] font-bold text-blue-200 uppercase tracking-widest mb-1">Total Target Value</div><div className="text-4xl font-black">$1.25M</div><div className="mt-2 text-xs font-bold text-green-300">+12% vs LY</div></div></div>
                        </div>
                        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                    </div>

                    <div className="flex flex-wrap gap-8 px-2 bg-white p-4 rounded-xl border border-slate-100 shadow-sm mb-6">
                        <div className="flex items-center gap-2.5 text-xs font-bold text-slate-600"><div className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center"><CheckCircle2 size={14} /></div><span>Active Product (Đã sử dụng)</span></div>
                        <div className="flex items-center gap-2.5 text-xs font-bold text-slate-600"><div className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center"><Hourglass size={14} /></div><span>In Pipeline (Đang đàm phán)</span></div>
                        <div className="flex items-center gap-2.5 text-xs font-bold text-slate-600"><div className="w-5 h-5 border border-slate-200 text-slate-300 rounded-full flex items-center justify-center"><PlusCircleIcon size={14} /></div><span>Whitespace (Khoảng trống)</span></div>
                        <div className="flex items-center gap-2.5 text-xs font-bold text-slate-600"><div className="w-5 h-5 bg-red-50 border border-red-100 text-red-400 rounded-full flex items-center justify-center"><XCircle size={14} /></div><span>Competitor (Đối thủ nắm giữ)</span></div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
                        <div className="overflow-x-auto pb-4 custom-scrollbar">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr>
                                        <th className="sticky left-0 z-20 bg-slate-50 border-b border-r border-slate-200 p-6 text-left min-w-[220px] shadow-[4px_0_12px_-4px_rgba(0,0,0,0.05)]"><span className="text-xs font-black text-slate-400 uppercase tracking-widest">Account Entity</span></th>
                                        {PRODUCT_CATEGORIES.map(product => (<th key={product.id} className="bg-slate-50 border-b border-r border-slate-100 p-6 min-w-[160px] last:border-r-0"><div className="flex flex-col items-center gap-1"><span className="text-sm font-black text-slate-800 tracking-tight">{product.name}</span><span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 py-0.5 bg-slate-100 rounded-full">{product.category}</span></div></th>))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {matrix.map(row => (
                                        <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="sticky left-0 z-10 bg-white border-b border-r border-slate-200 p-6 font-bold text-sm text-slate-800 shadow-[4px_0_12px_-4px_rgba(0,0,0,0.05)] transition-colors group-hover:bg-slate-50/50"><div className="flex flex-col">{row.name}<span className="text-[10px] text-slate-400 font-medium">Global ID: {row.id.toUpperCase()}</span></div></td>
                                            {PRODUCT_CATEGORIES.map(category => {
                                                const cell = row.cells[category.id] || { status: 'Whitespace' };
                                                const isHovering = hoveredCell?.rowId === row.id && hoveredCell?.prodId === category.id;
                                                return (<td key={`${row.id}-${category.id}`} className={`relative border-b border-r border-slate-100 p-6 text-center transition-all duration-200 last:border-r-0 ${cell.status === 'Whitespace' || cell.status === 'Owned' ? 'cursor-pointer hover:bg-blue-50/30' : ''} ${isHovering && (cell.status === 'Whitespace' || cell.status === 'Owned') ? 'bg-blue-50 shadow-inner' : ''}`} onMouseEnter={(e) => setHoveredCell({ rowId: row.id, prodId: category.id, rect: e.currentTarget.getBoundingClientRect() })} onMouseLeave={() => setHoveredCell(null)} onClick={() => handleCellClick(row.id, category.id, cell)}>{renderCellContent(cell)}</td>);
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* --- Modals for Industry & Market --- */}
            <Modal isOpen={isIndustryModalOpen} onClose={() => setIsIndustryModalOpen(false)} title="Edit Industry & Market Analysis" maxWidth="max-w-[80%]">
                <div className="py-2 space-y-10">
                    <div className="space-y-3 px-1"><label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Industry Name / Segment</label><input type="text" value={industryEdit.industry} onChange={e => setIndustryEdit({...industryEdit, industry: e.target.value})} className="w-full px-4 py-3 border border-slate-200 bg-white text-slate-900 rounded-xl font-bold text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm" placeholder="e.g. Manufacturing & Supply Chain" /></div>
                    <div className="space-y-6"><div className="flex justify-between items-center border-b border-slate-100 pb-3 px-1"><label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Industry Metrics</label><button onClick={handleAddMetric} className="flex items-center gap-1.5 text-xs font-black text-blue-600 hover:text-blue-700 transition-colors bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100"><PlusCircle size={14} /> ADD METRIC</button></div><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{industryEdit.metrics.map((metric) => (<div key={metric.id} className="relative p-5 bg-white rounded-2xl border border-slate-200 shadow-sm group/metric"><button onClick={() => handleDeleteMetric(metric.id)} className="absolute top-2 right-2 p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover/metric:opacity-100"><Trash2 size={16} /></button><div className="space-y-4 pt-2"><div className="space-y-1.5"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter ml-1">LABEL</label><input type="text" value={metric.label} onChange={(e) => handleUpdateMetric(metric.id, 'label', e.target.value)} className="w-full px-3 py-2 border border-slate-200 bg-white text-slate-800 rounded-lg font-bold text-[11px] focus:ring-2 focus:ring-blue-500 outline-none transition-all" /></div><div className="space-y-1.5"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter ml-1">VALUE</label><input type="text" value={metric.value} onChange={(e) => handleUpdateMetric(metric.id, 'value', e.target.value)} className="w-full px-3 py-2 border border-slate-200 bg-white text-blue-600 rounded-lg font-black text-[13px] focus:ring-2 focus:ring-blue-500 outline-none transition-all" /></div></div></div>))}</div></div>
                    <div className="space-y-4 px-1"><label className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Lightbulb size={14} className="text-blue-500" /> INSIGHTS</label><div className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm bg-white focus-within:border-blue-300 focus-within:ring-4 focus-within:ring-blue-50"><div className="flex items-center gap-1 p-2 bg-slate-50 border-b border-slate-200"><button className="p-1.5 text-slate-600 hover:bg-white hover:text-blue-600 rounded transition-all"><Bold size={16} /></button><button className="p-1.5 text-slate-600 hover:bg-white hover:text-blue-600 rounded transition-all"><Italic size={16} /></button><button className="p-1.5 text-slate-600 hover:bg-white hover:text-blue-600 rounded transition-all"><Underline size={16} /></button><div className="w-px h-5 bg-slate-200 mx-1"></div><button className="p-1.5 text-slate-600 hover:bg-white hover:text-blue-600 rounded transition-all"><AlignLeft size={16} /></button><button className="p-1.5 text-slate-600 hover:bg-white hover:text-blue-600 rounded transition-all"><AlignCenter size={16} /></button><button className="p-1.5 text-slate-600 hover:bg-white hover:text-blue-600 rounded transition-all"><AlignRight size={16} /></button><div className="w-px h-5 bg-slate-200 mx-1"></div><button className="p-1.5 text-slate-600 hover:bg-white hover:text-blue-600 rounded transition-all"><List size={16} /></button><button className="p-1.5 text-slate-600 hover:bg-white hover:text-blue-600 rounded transition-all"><ListOrdered size={16} /></button><div className="w-px h-5 bg-slate-200 mx-1"></div><button className="p-1.5 text-slate-600 hover:bg-white hover:text-blue-600 rounded transition-all"><Link size={16} /></button></div><textarea value={industryEdit.insights} onChange={e => setIndustryEdit({...industryEdit, insights: e.target.value})} className="w-full p-6 bg-white text-slate-900 outline-none text-sm min-h-[260px] font-medium transition-all" placeholder="Type industry insights and trends here..." /></div></div>
                    <div className="space-y-4 px-1"><label className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><UploadCloud size={14} className="text-blue-500" /> Supporting Documents</label><div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-slate-200 bg-slate-50 hover:bg-white hover:border-blue-300 transition-all rounded-2xl p-10 flex flex-col items-center justify-center gap-3 cursor-pointer group/upload">
                        {/* Fix: Explicitly type 'f' as 'File' to resolve type inference issue with Array.from(FileList) */}
                        <input type="file" ref={fileInputRef} onChange={(e) => { const sf = e.target.files; if(!sf) return; const nfs = Array.from(sf).map((f: File) => ({ id: Math.random().toString(36).substr(2, 9), name: f.name, type: f.type, size: (f.size / 1024 / 1024).toFixed(2) + ' MB' })); setIndustryEdit(prev => ({...prev, files: [...prev.files, ...nfs]})); }} className="hidden" multiple accept=".pdf,.doc,.docx,.xls,.xlsx,.csv" />
                        <div className="p-4 bg-white rounded-full shadow-sm text-slate-400 group-hover/upload:text-blue-600 group-hover/upload:scale-110 transition-all"><UploadCloud size={32} /></div><div className="text-center"><p className="text-sm font-black text-slate-700">Click or drag files to upload</p><p className="text-xs text-slate-400 font-medium mt-1">Supports PDF, Word, Excel (Max 10MB each)</p></div></div></div>
                    <div className="mt-8 pt-8 flex justify-end items-center gap-8 border-t border-slate-100"><button onClick={() => setIsIndustryModalOpen(false)} className="text-slate-600 hover:text-slate-800 text-sm font-bold transition-colors px-4">Cancel</button><button onClick={handleSaveIndustry} className="px-12 py-3 bg-blue-600 text-white hover:bg-blue-700 rounded-xl font-black text-xs shadow-xl shadow-blue-100 flex items-center gap-2 transition-all active:scale-95 group/btn"><Save size={20} className="transition-transform group-hover/btn:scale-110" /> Save Changes</button></div>
                </div>
            </Modal>

            {/* --- SWOT Modal --- */}
            <Modal isOpen={isSwotModalOpen} onClose={() => setIsSwotModalOpen(false)} title="Edit SWOT Matrix" maxWidth="max-w-3xl">
                <div className="grid grid-cols-2 gap-6 p-1">
                    <div className="space-y-3"><label className="text-xs font-black text-green-600 uppercase tracking-widest bg-green-50 px-2 py-1 rounded w-fit">STRENGTHS</label><textarea value={swotEdit.strengths} onChange={e => setSwotEdit({...swotEdit, strengths: e.target.value})} className="w-full p-4 border border-slate-200 bg-white text-slate-900 rounded-xl focus:ring-2 focus:ring-green-500 outline-none text-sm min-h-[150px]" placeholder="Enter strengths separated by period..." /></div>
                    <div className="space-y-3"><label className="text-xs font-black text-red-600 uppercase tracking-widest bg-red-50 px-2 py-1 rounded w-fit">WEAKNESSES</label><textarea value={swotEdit.weaknesses} onChange={e => setSwotEdit({...swotEdit, weaknesses: e.target.value})} className="w-full p-4 border border-slate-200 bg-white text-slate-900 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm min-h-[150px]" placeholder="Enter weaknesses separated by period..." /></div>
                    <div className="space-y-3"><label className="text-xs font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-1 rounded w-fit">OPPORTUNITIES</label><textarea value={swotEdit.opportunities} onChange={e => setSwotEdit({...swotEdit, opportunities: e.target.value})} className="w-full p-4 border border-slate-200 bg-white text-slate-900 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm min-h-[150px]" placeholder="Enter opportunities separated by period..." /></div>
                    <div className="space-y-3"><label className="text-xs font-black text-orange-600 uppercase tracking-widest bg-orange-50 px-2 py-1 rounded w-fit">THREATS</label><textarea value={swotEdit.threats} onChange={e => setSwotEdit({...swotEdit, threats: e.target.value})} className="w-full p-4 border border-slate-200 bg-white text-slate-900 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm min-h-[150px]" placeholder="Enter threats separated by period..." /></div>
                </div>
                <div className="mt-8 pt-4 flex justify-end gap-3 border-t border-slate-100"><button onClick={() => setIsSwotModalOpen(false)} className="px-4 py-2 text-slate-500 font-bold text-sm">Cancel</button><button onClick={handleSaveSwot} className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold text-sm hover:bg-blue-700 transition-colors">Save SWOT</button></div>
            </Modal>

            {/* --- Risk Modal --- */}
            <Modal isOpen={isRiskModalOpen} onClose={() => setIsRiskModalOpen(false)} title={editingRiskId ? "Edit Risk" : "Add Risk"} maxWidth="max-w-lg">
                <div className="space-y-5">
                    <div className="space-y-1.5"><label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Risk / Challenge Name</label><input type="text" value={riskFormData.risk} onChange={(e) => setRiskFormData({...riskFormData, risk: e.target.value})} className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none bg-white text-slate-900" placeholder="e.g. Budget cuts expected" /></div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5"><label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Impact Level</label><select value={riskFormData.impact} onChange={(e) => setRiskFormData({...riskFormData, impact: e.target.value as any})} className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none bg-white text-slate-900"><option value="Low">Low</option><option value="Medium">Medium</option><option value="High">High</option></select></div>
                        <div className="space-y-1.5"><label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Probability</label><select value={riskFormData.prob} onChange={(e) => setRiskFormData({...riskFormData, prob: e.target.value as any})} className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none bg-white text-slate-900"><option value="Low">Low</option><option value="Medium">Medium</option><option value="High">High</option></select></div>
                    </div>
                    <div className="space-y-1.5"><label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Mitigation Strategy</label><textarea value={riskFormData.mitigation} onChange={(e) => setRiskFormData({...riskFormData, mitigation: e.target.value})} className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none min-h-[100px] bg-white text-slate-900" placeholder="Describe how to handle this risk..." /></div>
                    <div className="mt-8 pt-4 flex justify-between items-center border-t border-slate-100">{editingRiskId && (<button onClick={() => handleDeleteRisk(editingRiskId)} className="text-red-500 hover:text-red-700 text-sm font-bold flex items-center gap-1"><Trash2 size={16} /> Delete</button>)}<div className="flex gap-3 ml-auto"><button onClick={() => setIsRiskModalOpen(false)} className="px-4 py-2 text-slate-500 font-bold text-sm">Cancel</button><button onClick={handleAddRisk} className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold text-sm hover:bg-blue-700 transition-colors">{editingRiskId ? 'Update Risk' : 'Add Risk'}</button></div></div>
                </div>
            </Modal>

            {/* --- Competitor Modal --- */}
            <Modal isOpen={isCompModalOpen} onClose={() => setIsCompModalOpen(false)} title={editingCompetitorId ? "Edit Competitor" : "Add Competitor"} maxWidth="max-w-2xl">
                <div className="space-y-5">
                    <div className="grid grid-cols-2 gap-4"><div className="space-y-1.5"><label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Competitor Name</label><input type="text" value={compFormData.name} onChange={(e) => setCompFormData({...compFormData, name: e.target.value})} className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none bg-white text-slate-900" /></div><div className="space-y-1.5"><label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Threat Level</label><select value={compFormData.threatLevel} onChange={(e) => setCompFormData({...compFormData, threatLevel: e.target.value as any})} className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none bg-white text-slate-900"><option value="Low">Low</option><option value="Medium">Medium</option><option value="High">High</option></select></div></div>
                    <div className="space-y-1.5"><label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Website</label><input type="text" value={compFormData.website} onChange={(e) => setCompFormData({...compFormData, website: e.target.value})} className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none bg-white text-slate-900" placeholder="example.com" /></div>
                    <div className="grid grid-cols-2 gap-4"><div className="space-y-1.5"><label className="text-[11px] font-black text-green-600 uppercase tracking-widest">Their Strengths</label><textarea value={compFormData.strengths} onChange={(e) => setCompFormData({...compFormData, strengths: e.target.value})} className="w-full px-4 py-3 border border-slate-200 bg-white text-slate-900 rounded-xl text-sm font-medium focus:ring-2 focus:ring-green-500 outline-none min-h-[100px]" /></div><div className="space-y-1.5"><label className="text-[11px] font-black text-red-500 uppercase tracking-widest">Their Weaknesses</label><textarea value={compFormData.weaknesses} onChange={(e) => setCompFormData({...compFormData, weaknesses: e.target.value})} className="w-full px-4 py-3 border border-slate-200 bg-white text-slate-900 rounded-xl text-sm font-medium focus:ring-2 focus:ring-red-500 outline-none min-h-[100px]" /></div></div>
                    <div className="space-y-1.5"><label className="text-[11px] font-black text-blue-600 uppercase tracking-widest">Our Differentiating Factors (USP)</label><textarea value={compFormData.differentiatingFactors} onChange={(e) => setCompFormData({...compFormData, differentiatingFactors: e.target.value})} className="w-full px-4 py-3 border border-blue-200 bg-white text-slate-900 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none min-h-[80px]" /></div>
                    <div className="mt-8 pt-4 flex justify-end gap-3 border-t border-slate-100"><button onClick={() => setIsCompModalOpen(false)} className="px-4 py-2 text-slate-500 font-bold text-sm">Cancel</button><button onClick={handleAddCompetitor} className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold text-sm hover:bg-blue-700 transition-colors">{editingCompetitorId ? 'Update Competitor' : 'Add Competitor'}</button></div>
                </div>
            </Modal>

            {/* --- Whitespace Related Portals & Modals --- */}
            {hoveredCell && createPortal((() => {
                const cell = matrix.find(r => r.id === hoveredCell.rowId)?.cells[hoveredCell.prodId];
                if (!cell) return null;
                const category = PRODUCT_CATEGORIES.find(c => c.id === hoveredCell.prodId);
                return (
                    <div className="fixed z-[9999] w-72 pointer-events-none animate-in fade-in zoom-in-95 duration-200" style={{ top: `${hoveredCell.rect.top}px`, left: `${hoveredCell.rect.left + hoveredCell.rect.width / 2}px`, transform: 'translate(-50%, -100%) translateY(-16px)' }}>
                         <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-5 text-left relative overflow-hidden"><div className="absolute left-1/2 -translate-x-1/2 top-full -mt-2 w-4 h-4 rotate-45 bg-white border-b border-r border-slate-200"></div>
                            {cell.status === 'Owned' && (<div className="space-y-3"><div className="flex justify-between items-center"><div className="text-[10px] font-black text-green-600 uppercase tracking-widest flex items-center gap-1.5"><CheckCircle2 size={14} /> Active Product</div><div className="text-[10px] font-bold text-slate-400">{category?.name}</div></div><div className="p-3 bg-green-50 rounded-xl border border-green-100"><div className="text-sm font-black text-green-900 leading-tight">{cell.productName}</div><div className="text-[10px] text-green-600 mt-1 font-bold">Product ID: {cell.productId}</div></div><div className="grid grid-cols-2 gap-2 text-[10px] font-bold"><div className="bg-slate-50 p-2 rounded-lg text-slate-500">Utilization: <span className="text-slate-800">92%</span></div><div className="bg-slate-50 p-2 rounded-lg text-slate-500">Revenue: <span className="text-slate-800">$12k/mo</span></div></div></div>)}
                            {cell.status === 'Pipeline' && (<div className="space-y-3"><div className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-1.5"><Hourglass size={14} /> In Discussion</div><div className="p-3 bg-blue-50 rounded-xl border border-blue-100"><p className="text-xs text-blue-800 font-bold">Opportunity: <b>{cell.opportunityStage}</b> stage.</p><p className="text-[10px] text-blue-500 mt-1 leading-relaxed">Proposal sent on Oct 12. Follow up required.</p></div></div>)}
                            {cell.status === 'Competitor' && (<div className="space-y-3"><div className="text-[10px] font-black text-red-500 uppercase tracking-widest flex items-center gap-1.5"><XCircle size={14} /> Competitive Risk</div><div className="p-3 bg-red-50 rounded-xl border border-red-100"><p className="text-xs text-red-800 font-bold">Held by <b>{cell.competitorName}</b>.</p><p className="text-[10px] text-red-500 mt-1 leading-relaxed italic">Renewal window opens in Dec 2024. Plan to target with discount.</p></div></div>)}
                            {cell.status === 'Whitespace' && (<div className="space-y-4"><div className="flex justify-between items-center"><span className="flex items-center gap-1.5 text-[10px] font-black text-purple-600 uppercase tracking-widest"><Sparkles size={14} className="animate-pulse" /> AI Strategic Insight</span><span className="text-[10px] font-black bg-purple-100 px-2 py-0.5 rounded-full text-purple-700">{cell.propensityScore}% Score</span></div><div className={`text-xs p-3 rounded-xl border leading-relaxed font-medium ${cell.propensityScore && cell.propensityScore >= 80 ? 'text-green-600 bg-green-50 border-green-200' : cell.propensityScore && cell.propensityScore >= 50 ? 'text-orange-600 bg-orange-50 border-orange-200' : 'text-slate-500 bg-slate-50 border-slate-200'}`}>{cell.recommendation}</div><div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100"><span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Estimated Revenue</span><span className="text-sm font-black text-slate-800">{cell.estimatedValue ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(cell.estimatedValue) : 'TBD'}</span></div></div>)}
                         </div>
                    </div>
                );
            })(), document.body)}

            <Modal isOpen={isProductSelectModalOpen} onClose={() => setIsProductSelectModalOpen(false)} title="Thay đổi sản phẩm đang sử dụng" maxWidth="max-w-md">
                <div className="space-y-5"><div className="p-4 bg-blue-50 rounded-xl border border-blue-100 flex gap-4"><div className="bg-white p-2 rounded-full h-fit text-blue-600 shadow-sm shrink-0"><Package size={20} /></div><div><p className="text-xs text-blue-800 leading-relaxed font-bold">Khách hàng đang sử dụng giải pháp thuộc nhóm <b>{PRODUCT_CATEGORIES.find(p => p.id === selectedCellInfo?.prodId)?.name}</b>.</p><p className="text-[10px] text-blue-500 mt-1">Chọn sản phẩm định danh chính xác để theo dõi hiệu suất.</p></div></div>
                    <div className="relative"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} /><input type="text" placeholder="Tìm kiếm sản phẩm trong danh mục..." className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl bg-white text-slate-900 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all" value={productSearch} onChange={(e) => setProductSearch(e.target.value)} /></div>
                    <div className="max-h-72 overflow-y-auto space-y-2.5 pr-1 custom-scrollbar">{DETAILED_PRODUCTS.filter(p => p.name.toLowerCase().includes(productSearch.toLowerCase())).map(prod => (<button key={prod.id} onClick={() => handleSelectProduct(prod)} className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 text-left transition-all group ${selectedCellInfo?.data.productId === prod.id ? 'border-blue-500 bg-blue-50/50' : 'border-slate-50 bg-slate-50 hover:bg-white hover:border-blue-200'}`}><div className="flex items-center gap-4"><div className={`p-2.5 rounded-xl ${selectedCellInfo?.data.productId === prod.id ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'bg-white text-slate-400 group-hover:text-blue-600 border border-slate-100'}`}><Package size={18} /></div><div><div className="text-sm font-black text-slate-800 leading-tight">{prod.name}</div><div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-0.5">{prod.category}</div></div></div>{selectedCellInfo?.data.productId === prod.id ? <CheckCircle2 size={20} className="text-blue-600" /> : <div className="text-slate-300 group-hover:text-blue-500 transition-colors"><ChevronRight size={20} /></div>}</button>))}</div>
                    <div className="pt-5 flex justify-end gap-3 border-t border-slate-100"><button onClick={() => setIsProductSelectModalOpen(false)} className="px-6 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-black text-sm transition-colors">Cancel</button></div>
                </div>
            </Modal>

            <Modal isOpen={isOppModalOpen} onClose={() => setIsOppModalOpen(false)} title="Create Opportunity from Whitespace" maxWidth="max-w-md">
                <div className="space-y-5"><div className="bg-purple-50 p-5 rounded-2xl border border-purple-100 flex gap-4"><div className="bg-white p-3 rounded-full h-fit shadow-md text-purple-600 shrink-0"><Sparkles size={20} /></div><div><h4 className="text-sm font-black text-purple-900 uppercase tracking-tight">AI Conversion Strategy</h4><p className="text-xs text-purple-700 mt-1 leading-relaxed font-medium">{selectedCellInfo?.data.recommendation}</p></div></div>
                    <div className="space-y-2"><label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Selected Product <span className="text-red-500">*</span></label><div className="relative"><button onClick={() => setIsProductPickerOpen(!isProductPickerOpen)} className="w-full flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl hover:bg-white hover:border-blue-400 transition-all text-left"><div className="flex items-center gap-4"><div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl shadow-sm"><Package size={20} /></div><div><div className="text-sm font-black text-slate-800">{oppForm.detailedProductName || "Select a product..."}</div><div className="text-[10px] text-slate-400 uppercase font-black tracking-widest">{oppForm.categoryName}</div></div></div><ChevronDown size={18} className={`text-slate-400 transition-transform ${isProductPickerOpen ? 'rotate-180' : ''}`} /></button>
                    {isProductPickerOpen && (<div className="absolute z-20 mt-2 w-full bg-white border border-slate-200 rounded-2xl shadow-2xl max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-2">{DETAILED_PRODUCTS.filter(p => p.parentCategoryId === selectedCellInfo?.prodId).map(prod => (<button key={prod.id} onClick={() => handlePickProductForOpp(prod)} className={`w-full text-left p-4 hover:bg-slate-50 flex items-center justify-between transition-colors border-b border-slate-50 last:border-0 ${oppForm.detailedProductId === prod.id ? 'bg-blue-50/50' : ''}`}><span className="text-sm font-bold text-slate-700">{prod.name}</span>{oppForm.detailedProductId === prod.id && <CheckCircle2 size={16} className="text-blue-600" />}</button>))}</div>)}</div></div>
                    <div className="space-y-2"><label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Opportunity Name</label><input type="text" value={oppForm.name} onChange={(e) => setOppForm({...oppForm, name: e.target.value})} className="w-full px-4 py-3 border border-slate-200 bg-white text-slate-900 rounded-xl font-bold text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all" /></div>
                    <div className="space-y-2"><label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Expected Amount</label><div className="relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span><input type="number" value={oppForm.amount} onChange={(e) => setOppForm({...oppForm, amount: e.target.value})} className="w-full pl-10 pr-4 py-3 border border-slate-200 bg-white text-slate-900 rounded-xl font-bold text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all" /></div></div>
                    <div className="grid grid-cols-2 gap-4"><div className="space-y-2"><label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Stage</label><select value={oppForm.stage} onChange={(e) => setOppForm({...oppForm, stage: e.target.value})} className="w-full px-4 py-3 border border-slate-200 bg-white text-slate-900 rounded-xl font-bold text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none"><option value="Qualification">Qualification</option><option value="Discovery">Discovery</option><option value="Proposal">Proposal</option><option value="Negotiation">Negotiation</option></select></div><div className="space-y-2"><label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Target Close Date</label><input type="date" value={oppForm.closeDate} onChange={(e) => setOppForm({...oppForm, closeDate: e.target.value})} className="w-full px-4 py-3 border border-slate-200 bg-white text-slate-900 rounded-xl font-bold text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all" /></div></div>
                    <div className="pt-5 flex justify-end gap-3 border-t border-slate-100"><button onClick={() => setIsOppModalOpen(false)} className="px-6 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-black text-sm transition-colors">Cancel</button><button onClick={() => setIsOppModalOpen(false)} disabled={!oppForm.detailedProductId} className="px-8 py-2.5 bg-blue-600 text-white hover:bg-blue-700 rounded-xl font-black text-sm shadow-xl shadow-blue-200 flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"><Briefcase size={18} /> Create Opportunity</button></div>
                </div>
            </Modal>
        </div>
    );
};

export default MarketTab;