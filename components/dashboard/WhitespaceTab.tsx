
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { AccountPlan } from '../../types';
import { 
    CheckCircle2, 
    Hourglass, 
    XCircle, 
    PlusCircle, 
    Sparkles, 
    DollarSign,
    Briefcase,
    Package,
    Search,
    ChevronRight,
    Info,
    Edit3,
    ChevronDown
} from 'lucide-react';
import Modal from '../ui/Modal';

interface WhitespaceTabProps {
    plan: AccountPlan;
}

// Types for the Matrix
type CellStatus = 'Owned' | 'Pipeline' | 'Whitespace' | 'Competitor';

interface CellData {
    status: CellStatus;
    // For Whitespace
    propensityScore?: number;
    estimatedValue?: number;
    recommendation?: string;
    // For Pipeline
    opportunityStage?: string;
    // For Competitor
    competitorName?: string;
    // For Active Products (Owned)
    productId?: string;
    productName?: string;
}

interface MatrixRow {
    id: string;
    name: string; // Entity/Subsidiary Name
    cells: Record<string, CellData>; // Key is Product Category ID
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

// Mock Data - Ensuring Active Products have specific products already
const generateMockMatrix = (): MatrixRow[] => {
    return [
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
};

const WhitespaceTab: React.FC<WhitespaceTabProps> = ({ plan }) => {
    const [matrix, setMatrix] = useState<MatrixRow[]>(generateMockMatrix());
    const [hoveredCell, setHoveredCell] = useState<{ rowId: string, prodId: string, rect: DOMRect } | null>(null);
    const [isOppModalOpen, setIsOppModalOpen] = useState(false);
    const [isProductSelectModalOpen, setIsProductSelectModalOpen] = useState(false);
    const [isProductPickerOpen, setIsProductPickerOpen] = useState(false);
    const [selectedCellInfo, setSelectedCellInfo] = useState<{ rowId: string, prodId: string, data: CellData } | null>(null);
    
    // Create Opportunity Form State
    const [oppForm, setOppForm] = useState({
        name: '',
        amount: '',
        stage: 'Qualification',
        closeDate: '',
        categoryId: '',
        categoryName: '',
        detailedProductId: '',
        detailedProductName: ''
    });

    const [productSearch, setProductSearch] = useState('');

    const handleCellClick = (rowId: string, prodId: string, cell: CellData) => {
        setSelectedCellInfo({ rowId, prodId, data: cell });
        
        if (cell.status === 'Whitespace') {
            const category = PRODUCT_CATEGORIES.find(p => p.id === prodId);
            const entityName = ENTITIES.find(e => e.id === rowId)?.name;
            
            // Default suggest the first product in this category if available
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

        setMatrix(prev => prev.map(row => {
            if (row.id === selectedCellInfo.rowId) {
                return {
                    ...row,
                    cells: {
                        ...row.cells,
                        [selectedCellInfo.prodId]: {
                            ...row.cells[selectedCellInfo.prodId],
                            productId: detailedProd.id,
                            productName: detailedProd.name
                        }
                    }
                };
            }
            return row;
        }));
        setIsProductSelectModalOpen(false);
        setProductSearch('');
    };

    const handlePickProductForOpp = (prod: typeof DETAILED_PRODUCTS[0]) => {
        const entityName = ENTITIES.find(e => e.id === selectedCellInfo?.rowId)?.name;
        setOppForm(prev => ({
            ...prev,
            detailedProductId: prod.id,
            detailedProductName: prod.name,
            name: `Opportunity: ${prod.name} - ${entityName}`
        }));
        setIsProductPickerOpen(false);
    };

    const formatCurrency = (val?: number) => {
        if (!val) return 'TBD';
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
    };

    const renderCellContent = (cell: CellData) => {
        switch (cell.status) {
            case 'Owned':
                return (
                    <div className="flex flex-col items-center gap-1 group">
                        <div className="bg-green-100 text-green-700 p-1.5 rounded-full shadow-sm group-hover:scale-110 transition-transform">
                            <CheckCircle2 size={18} strokeWidth={2.5} />
                        </div>
                        <div className="max-w-[110px] truncate">
                            <span className="text-[10px] font-bold text-slate-700 leading-none">
                                {cell.productName || 'Chưa định danh'}
                            </span>
                        </div>
                        <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Edit3 size={10} className="text-slate-400" />
                        </div>
                    </div>
                );
            case 'Pipeline':
                return (
                    <div className="flex flex-col items-center gap-1">
                        <div className="bg-blue-100 text-blue-600 p-1.5 rounded-full">
                            <Hourglass size={18} className="animate-pulse" />
                        </div>
                        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-tighter">
                            {cell.opportunityStage}
                        </span>
                    </div>
                );
            case 'Competitor':
                return (
                    <div className="flex flex-col items-center gap-1">
                        <div className="bg-red-50 text-red-400 p-1.5 rounded-full border border-red-100">
                            <XCircle size={18} />
                        </div>
                        <span className="text-[10px] font-bold text-red-400 truncate max-w-[100px]">
                            {cell.competitorName}
                        </span>
                    </div>
                );
            case 'Whitespace':
                return (
                    <div className="flex flex-col items-center gap-1 group-hover:scale-110 transition-transform">
                        <PlusCircle className="text-slate-300 group-hover:text-blue-600" size={24} />
                        {cell.propensityScore && cell.propensityScore > 75 && (
                            <span className="absolute top-2 right-2 flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                            </span>
                        )}
                    </div>
                );
            default:
                return null;
        }
    };

    const getRecommendationColor = (score: number) => {
        if (score >= 80) return 'text-green-600 bg-green-50 border-green-200';
        if (score >= 50) return 'text-orange-600 bg-orange-50 border-orange-200';
        return 'text-slate-500 bg-slate-50 border-slate-200';
    };

    const filteredDetailedProducts = DETAILED_PRODUCTS.filter(p => 
        p.name.toLowerCase().includes(productSearch.toLowerCase())
    );

    // Products specifically for the selected category in Whitespace conversion
    const categorySpecificProducts = DETAILED_PRODUCTS.filter(p => 
        p.parentCategoryId === selectedCellInfo?.prodId
    );

    return (
        <div className="space-y-6 animate-fade-in pb-10">
            {/* AI Insights Header */}
            <div className="bg-gradient-to-br from-indigo-700 via-blue-600 to-blue-500 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    <div className="md:col-span-8">
                        <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-xs font-bold mb-4 backdrop-blur-md">
                            <Sparkles size={14} className="text-yellow-300" /> AI ECOSYSTEM ANALYSIS
                        </div>
                        <h2 className="text-3xl font-black mb-3 leading-tight tracking-tight">
                            Identify & Convert <br/>Whitespace Opportunities
                        </h2>
                        <p className="text-blue-50/80 text-sm max-w-xl leading-relaxed">
                            Based on account transaction behavior and peer benchmarking, we've prioritized 
                            <span className="mx-1 text-white font-black underline decoration-yellow-400 decoration-2 underline-offset-4">3 High Potential</span> 
                            opportunities across subsidiaries.
                        </p>
                    </div>
                    <div className="md:col-span-4 flex justify-end">
                        <div className="bg-white/10 p-6 rounded-2xl border border-white/20 backdrop-blur-md text-center">
                            <div className="text-[10px] font-bold text-blue-200 uppercase tracking-widest mb-1">Total Target Value</div>
                            <div className="text-4xl font-black">$1.25M</div>
                            <div className="mt-2 text-xs font-bold text-green-300">+12% vs LY</div>
                        </div>
                    </div>
                </div>
                <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            </div>

            {/* Matrix Legend */}
            <div className="flex flex-wrap gap-8 px-2 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-2.5 text-xs font-bold text-slate-600">
                    <div className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                        <CheckCircle2 size={14} />
                    </div>
                    <span>Active Product (Đã sử dụng)</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs font-bold text-slate-600">
                    <div className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                        <Hourglass size={14} />
                    </div>
                    <span>In Pipeline (Đang đàm phán)</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs font-bold text-slate-600">
                    <div className="w-5 h-5 border border-slate-200 text-slate-300 rounded-full flex items-center justify-center">
                        <PlusCircle size={14} />
                    </div>
                    <span>Whitespace (Khoảng trống)</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs font-bold text-slate-600">
                    <div className="w-5 h-5 bg-red-50 border border-red-100 text-red-400 rounded-full flex items-center justify-center">
                        <XCircle size={14} />
                    </div>
                    <span>Competitor (Đối thủ nắm giữ)</span>
                </div>
            </div>

            {/* Matrix Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
                <div className="overflow-x-auto pb-4 custom-scrollbar">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr>
                                <th className="sticky left-0 z-20 bg-slate-50 border-b border-r border-slate-200 p-6 text-left min-w-[220px] shadow-[4px_0_12px_-4px_rgba(0,0,0,0.05)]">
                                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Account Entity</span>
                                </th>
                                {PRODUCT_CATEGORIES.map(product => (
                                    <th key={product.id} className="bg-slate-50 border-b border-r border-slate-100 p-6 min-w-[160px] last:border-r-0">
                                        <div className="flex flex-col items-center gap-1">
                                            <span className="text-sm font-black text-slate-800 tracking-tight">{product.name}</span>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 py-0.5 bg-slate-100 rounded-full">
                                                {product.category}
                                            </span>
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {matrix.map(row => (
                                <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="sticky left-0 z-10 bg-white border-b border-r border-slate-200 p-6 font-bold text-sm text-slate-800 shadow-[4px_0_12px_-4px_rgba(0,0,0,0.05)] transition-colors group-hover:bg-slate-50/50">
                                        <div className="flex flex-col">
                                            {row.name}
                                            <span className="text-[10px] text-slate-400 font-medium">Global ID: {row.id.toUpperCase()}</span>
                                        </div>
                                    </td>
                                    {PRODUCT_CATEGORIES.map(category => {
                                        const cell = row.cells[category.id] || { status: 'Whitespace' };
                                        const isHovering = hoveredCell?.rowId === row.id && hoveredCell?.prodId === category.id;
                                        
                                        return (
                                            <td 
                                                key={`${row.id}-${category.id}`}
                                                className={`relative border-b border-r border-slate-100 p-6 text-center transition-all duration-200 last:border-r-0
                                                    ${cell.status === 'Whitespace' || cell.status === 'Owned' ? 'cursor-pointer hover:bg-blue-50/30' : ''}
                                                    ${isHovering && (cell.status === 'Whitespace' || cell.status === 'Owned') ? 'bg-blue-50 shadow-inner' : ''}
                                                `}
                                                onMouseEnter={(e) => {
                                                    const rect = e.currentTarget.getBoundingClientRect();
                                                    setHoveredCell({ rowId: row.id, prodId: category.id, rect });
                                                }}
                                                onMouseLeave={() => setHoveredCell(null)}
                                                onClick={() => handleCellClick(row.id, category.id, cell)}
                                            >
                                                {renderCellContent(cell)}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Tooltip Portal */}
            {hoveredCell && createPortal(
                (() => {
                    const row = matrix.find(r => r.id === hoveredCell.rowId);
                    const cell = row?.cells[hoveredCell.prodId];
                    const category = PRODUCT_CATEGORIES.find(c => c.id === hoveredCell.prodId);
                    if (!cell) return null;

                    return (
                        <div 
                            className="fixed z-[9999] w-72 pointer-events-none animate-in fade-in zoom-in-95 duration-200"
                            style={{
                                top: `${hoveredCell.rect.top}px`,
                                left: `${hoveredCell.rect.left + hoveredCell.rect.width / 2}px`,
                                transform: 'translate(-50%, -100%) translateY(-16px)'
                            }}
                        >
                             <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-5 text-left relative overflow-hidden">
                                <div className="absolute left-1/2 -translate-x-1/2 top-full -mt-2 w-4 h-4 rotate-45 bg-white border-b border-r border-slate-200"></div>
                                
                                {cell.status === 'Owned' && (
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <div className="text-[10px] font-black text-green-600 uppercase tracking-widest flex items-center gap-1.5">
                                                <CheckCircle2 size={14} /> Active Product
                                            </div>
                                            <div className="text-[10px] font-bold text-slate-400">{category?.name}</div>
                                        </div>
                                        <div className="p-3 bg-green-50 rounded-xl border border-green-100">
                                            <div className="text-sm font-black text-green-900 leading-tight">{cell.productName}</div>
                                            <div className="text-[10px] text-green-600 mt-1 font-bold">Product ID: {cell.productId}</div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 text-[10px] font-bold">
                                            <div className="bg-slate-50 p-2 rounded-lg text-slate-500">Utilization: <span className="text-slate-800">92%</span></div>
                                            <div className="bg-slate-50 p-2 rounded-lg text-slate-500">Revenue: <span className="text-slate-800">$12k/mo</span></div>
                                        </div>
                                    </div>
                                )}

                                {cell.status === 'Pipeline' && (
                                    <div className="space-y-3">
                                        <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-1.5">
                                            <Hourglass size={14} /> In Discussion
                                        </div>
                                        <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                                            <p className="text-xs text-blue-800 font-bold">Opportunity: <b>{cell.opportunityStage}</b> stage.</p>
                                            <p className="text-[10px] text-blue-500 mt-1 leading-relaxed">Proposal sent on Oct 12. Follow up required.</p>
                                        </div>
                                    </div>
                                )}

                                {cell.status === 'Competitor' && (
                                    <div className="space-y-3">
                                        <div className="text-[10px] font-black text-red-500 uppercase tracking-widest flex items-center gap-1.5">
                                            <XCircle size={14} /> Competitive Risk
                                        </div>
                                        <div className="p-3 bg-red-50 rounded-xl border border-red-100">
                                            <p className="text-xs text-red-800 font-bold">Held by <b>{cell.competitorName}</b>.</p>
                                            <p className="text-[10px] text-red-500 mt-1 leading-relaxed italic">Renewal window opens in Dec 2024. Plan to target with discount.</p>
                                        </div>
                                    </div>
                                )}

                                {cell.status === 'Whitespace' && (
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="flex items-center gap-1.5 text-[10px] font-black text-purple-600 uppercase tracking-widest">
                                                <Sparkles size={14} className="animate-pulse" /> AI Strategic Insight
                                            </span>
                                            <span className="text-[10px] font-black bg-purple-100 px-2 py-0.5 rounded-full text-purple-700">
                                                {cell.propensityScore}% Score
                                            </span>
                                        </div>
                                        <div className={`text-xs p-3 rounded-xl border leading-relaxed font-medium ${getRecommendationColor(cell.propensityScore || 0)}`}>
                                            {cell.recommendation}
                                        </div>
                                        <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                                            <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Estimated Revenue</span>
                                            <span className="text-sm font-black text-slate-800">{formatCurrency(cell.estimatedValue)}</span>
                                        </div>
                                    </div>
                                )}
                             </div>
                        </div>
                    );
                })(),
                document.body
            )}

            {/* Change Active Product Modal */}
            <Modal
                isOpen={isProductSelectModalOpen}
                onClose={() => setIsProductSelectModalOpen(false)}
                title="Thay đổi sản phẩm đang sử dụng"
                maxWidth="max-w-md"
            >
                <div className="space-y-5">
                    <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 flex gap-4">
                        <div className="bg-white p-2 rounded-full h-fit text-blue-600 shadow-sm shrink-0">
                            <Package size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-blue-800 leading-relaxed font-bold">
                                Khách hàng đang sử dụng giải pháp thuộc nhóm <b>{PRODUCT_CATEGORIES.find(p => p.id === selectedCellInfo?.prodId)?.name}</b>.
                            </p>
                            <p className="text-[10px] text-blue-500 mt-1">Chọn sản phẩm định danh chính xác để theo dõi hiệu suất.</p>
                        </div>
                    </div>

                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="text"
                            placeholder="Tìm kiếm sản phẩm trong danh mục..."
                            className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            value={productSearch}
                            onChange={(e) => setProductSearch(e.target.value)}
                        />
                    </div>

                    <div className="max-h-72 overflow-y-auto space-y-2.5 pr-1 custom-scrollbar">
                        {filteredDetailedProducts.length === 0 ? (
                            <div className="text-center py-12 flex flex-col items-center gap-2">
                                <Search size={32} className="text-slate-200" />
                                <p className="text-slate-400 text-sm font-medium">Không tìm thấy sản phẩm nào.</p>
                            </div>
                        ) : (
                            filteredDetailedProducts.map(prod => (
                                <button
                                    key={prod.id}
                                    onClick={() => handleSelectProduct(prod)}
                                    className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 text-left transition-all group
                                        ${selectedCellInfo?.data.productId === prod.id 
                                            ? 'border-blue-500 bg-blue-50/50' 
                                            : 'border-slate-50 bg-slate-50 hover:bg-white hover:border-blue-200'}
                                    `}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2.5 rounded-xl ${selectedCellInfo?.data.productId === prod.id ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'bg-white text-slate-400 group-hover:text-blue-600 border border-slate-100'}`}>
                                            <Package size={18} />
                                        </div>
                                        <div>
                                            <div className="text-sm font-black text-slate-800 leading-tight">{prod.name}</div>
                                            <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-0.5">{prod.category}</div>
                                        </div>
                                    </div>
                                    {selectedCellInfo?.data.productId === prod.id ? (
                                        <CheckCircle2 size={20} className="text-blue-600" />
                                    ) : (
                                        <div className="text-slate-300 group-hover:text-blue-500 transition-colors">
                                            <ChevronRight size={20} />
                                        </div>
                                    )}
                                </button>
                            ))
                        )}
                    </div>

                    <div className="pt-5 flex justify-end gap-3 border-t border-slate-100">
                        <button 
                            onClick={() => setIsProductSelectModalOpen(false)}
                            className="px-6 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-black text-sm transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Create Opportunity Modal */}
            <Modal
                isOpen={isOppModalOpen}
                onClose={() => setIsOppModalOpen(false)}
                title="Create Opportunity from Whitespace"
                maxWidth="max-w-md"
            >
                <div className="space-y-5">
                    <div className="bg-purple-50 p-5 rounded-2xl border border-purple-100 flex gap-4">
                         <div className="bg-white p-3 rounded-full h-fit shadow-md text-purple-600 shrink-0">
                            <Sparkles size={20} />
                         </div>
                         <div>
                             <h4 className="text-sm font-black text-purple-900 uppercase tracking-tight">AI Conversion Strategy</h4>
                             <p className="text-xs text-purple-700 mt-1 leading-relaxed font-medium">
                                 {selectedCellInfo?.data.recommendation}
                             </p>
                         </div>
                    </div>

                    {/* Product Selection for Opportunity */}
                    <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Selected Product <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <button 
                                onClick={() => setIsProductPickerOpen(!isProductPickerOpen)}
                                className="w-full flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-2xl hover:bg-white hover:border-blue-400 transition-all text-left"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl shadow-sm">
                                        <Package size={20} />
                                    </div>
                                    <div>
                                        <div className="text-sm font-black text-slate-800">
                                            {oppForm.detailedProductName || "Select a product..."}
                                        </div>
                                        <div className="text-[10px] text-slate-400 uppercase font-black tracking-widest">
                                            {oppForm.categoryName}
                                        </div>
                                    </div>
                                </div>
                                <ChevronDown size={18} className={`text-slate-400 transition-transform ${isProductPickerOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Dropdown for picking product */}
                            {isProductPickerOpen && (
                                <div className="absolute z-20 mt-2 w-full bg-white border border-slate-200 rounded-2xl shadow-2xl max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-2">
                                    {categorySpecificProducts.length > 0 ? (
                                        categorySpecificProducts.map(prod => (
                                            <button
                                                key={prod.id}
                                                onClick={() => handlePickProductForOpp(prod)}
                                                className={`w-full text-left p-4 hover:bg-slate-50 flex items-center justify-between transition-colors border-b border-slate-50 last:border-0 ${oppForm.detailedProductId === prod.id ? 'bg-blue-50/50' : ''}`}
                                            >
                                                <span className="text-sm font-bold text-slate-700">{prod.name}</span>
                                                {oppForm.detailedProductId === prod.id && <CheckCircle2 size={16} className="text-blue-600" />}
                                            </button>
                                        ))
                                    ) : (
                                        <div className="p-4 text-center text-xs text-slate-400 font-bold">No specific products found for this category.</div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Opportunity Name</label>
                        <input 
                            type="text" 
                            value={oppForm.name}
                            onChange={(e) => setOppForm({...oppForm, name: e.target.value})}
                            className="w-full px-4 py-3 border border-slate-200 bg-white text-slate-900 rounded-xl font-bold text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Expected Amount</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                            <input 
                                type="number" 
                                value={oppForm.amount}
                                onChange={(e) => setOppForm({...oppForm, amount: e.target.value})}
                                className="w-full pl-10 pr-4 py-3 border border-slate-200 bg-white text-slate-900 rounded-xl font-bold text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Stage</label>
                            <select 
                                value={oppForm.stage}
                                onChange={(e) => setOppForm({...oppForm, stage: e.target.value})}
                                className="w-full px-4 py-3 border border-slate-200 bg-white text-slate-900 rounded-xl font-bold text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none"
                            >
                                <option value="Qualification">Qualification</option>
                                <option value="Discovery">Discovery</option>
                                <option value="Proposal">Proposal</option>
                                <option value="Negotiation">Negotiation</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Target Close Date</label>
                            <input 
                                type="date" 
                                value={oppForm.closeDate}
                                onChange={(e) => setOppForm({...oppForm, closeDate: e.target.value})}
                                className="w-full px-4 py-3 border border-slate-200 bg-white text-slate-900 rounded-xl font-bold text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="pt-5 flex justify-end gap-3 border-t border-slate-100">
                        <button 
                            onClick={() => setIsOppModalOpen(false)}
                            className="px-6 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-black text-sm transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={() => setIsOppModalOpen(false)}
                            disabled={!oppForm.detailedProductId}
                            className="px-8 py-2.5 bg-blue-600 text-white hover:bg-blue-700 rounded-xl font-black text-sm shadow-xl shadow-blue-200 flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
                        >
                           <Briefcase size={18} /> Create Opportunity
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default WhitespaceTab;
