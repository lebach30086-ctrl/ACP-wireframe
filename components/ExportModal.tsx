import React, { useState, useEffect } from 'react';
import Modal from './ui/Modal';
import { 
    FileText, 
    Table, 
    Presentation, 
    Check, 
    Download, 
    Loader2,
    Sparkles,
    Cpu
} from 'lucide-react';
import { AccountPlan } from '../types';

interface ExportModalProps {
    isOpen: boolean;
    onClose: () => void;
    plan: AccountPlan;
}

type ExportFormat = 'PDF' | 'EXCEL' | 'PPT';

const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, plan }) => {
    const [format, setFormat] = useState<ExportFormat>('PDF');
    const [sections, setSections] = useState({
        overview: true,
        stakeholders: true,
        strategic: true,
        whitespace: true,
        actionPlan: true,
        approval: true
    });
    const [isExporting, setIsExporting] = useState(false);
    const [aiStep, setAiStep] = useState(0);

    const aiSteps = [
        "Analyzing account data...",
        "Generating executive summaries...",
        "Identifying strategic insights...",
        "Designing presentation deck...",
        "Finalizing AI content..."
    ];

    useEffect(() => {
        let interval: any;
        if (isExporting && format === 'PPT') {
            interval = setInterval(() => {
                setAiStep(prev => (prev < aiSteps.length - 1 ? prev + 1 : prev));
            }, 800);
        } else {
            setAiStep(0);
        }
        return () => clearInterval(interval);
    }, [isExporting, format]);

    const toggleSection = (key: keyof typeof sections) => {
        setSections(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleDownload = () => {
        setIsExporting(true);
        // PPT takes longer as it "uses AI"
        const delay = format === 'PPT' ? 4500 : 2000;
        
        setTimeout(() => {
            setIsExporting(false);
            onClose();
        }, delay);
    };

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            title="Xuất báo cáo kế hoạch" 
            maxWidth="max-w-2xl"
        >
            <div className="space-y-8">
                {/* Format Selection */}
                <div className="space-y-3">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Chọn định dạng xuất</label>
                    <div className="grid grid-cols-3 gap-4">
                        <button 
                            onClick={() => setFormat('PDF')}
                            className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all ${format === 'PDF' ? 'border-blue-600 bg-blue-50/50 shadow-md' : 'border-slate-100 bg-slate-50 hover:border-blue-200'}`}
                        >
                            <div className={`p-3 rounded-full ${format === 'PDF' ? 'bg-blue-600 text-white' : 'bg-white text-slate-400'}`}>
                                <FileText size={24} />
                            </div>
                            <div className="text-center">
                                <div className="font-bold text-sm text-slate-800">PDF</div>
                                <div className="text-[10px] text-slate-500 font-medium">Báo cáo chính thức</div>
                            </div>
                        </button>
                        <button 
                            onClick={() => setFormat('EXCEL')}
                            className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all ${format === 'EXCEL' ? 'border-green-600 bg-green-50/50 shadow-md' : 'border-slate-100 bg-slate-50 hover:border-blue-200'}`}
                        >
                            <div className={`p-3 rounded-full ${format === 'EXCEL' ? 'bg-green-600 text-white' : 'bg-white text-slate-400'}`}>
                                <Table size={24} />
                            </div>
                            <div className="text-center">
                                <div className="font-bold text-sm text-slate-800">Excel</div>
                                <div className="text-[10px] text-slate-500 font-medium">Phân tích dữ liệu</div>
                            </div>
                        </button>
                        <button 
                            onClick={() => setFormat('PPT')}
                            className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all relative overflow-hidden group ${format === 'PPT' ? 'border-purple-600 bg-purple-50/50 shadow-md' : 'border-slate-100 bg-slate-50 hover:border-purple-200'}`}
                        >
                            {/* AI Badge */}
                            <div className="absolute top-0 right-0">
                                <div className="bg-gradient-to-l from-purple-600 to-indigo-600 text-white text-[9px] font-black px-2 py-0.5 rounded-bl-lg flex items-center gap-1 shadow-sm">
                                    <Sparkles size={8} fill="white" /> AI POWERED
                                </div>
                            </div>

                            <div className={`p-3 rounded-full transition-colors ${format === 'PPT' ? 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white' : 'bg-white text-slate-400 group-hover:text-purple-500'}`}>
                                <Presentation size={24} />
                            </div>
                            <div className="text-center">
                                <div className="font-bold text-sm text-slate-800 flex items-center justify-center gap-1">
                                    PowerPoint
                                </div>
                                <div className="text-[10px] text-slate-500 font-medium leading-tight">Tự động soạn slide thuyết trình</div>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Content Selection */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Nội dung bao gồm</label>
                        <button 
                            onClick={() => setSections({ overview: true, stakeholders: true, strategic: true, whitespace: true, actionPlan: true, approval: true })}
                            className="text-xs text-blue-600 font-bold hover:underline"
                        >
                            Chọn tất cả
                        </button>
                    </div>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                        <SectionToggle label="Overview & Performance" isActive={sections.overview} onClick={() => toggleSection('overview')} />
                        <SectionToggle label="Stakeholder Map" isActive={sections.stakeholders} onClick={() => toggleSection('stakeholders')} />
                        <SectionToggle label="Strategic Analysis" isActive={sections.strategic} onClick={() => toggleSection('strategic')} />
                        <SectionToggle label="White Space Analysis" isActive={sections.whitespace} onClick={() => toggleSection('whitespace')} />
                        <SectionToggle label="Action Plan & Tracking" isActive={sections.actionPlan} onClick={() => toggleSection('actionPlan')} />
                        <SectionToggle label="Approval & Budget" isActive={sections.approval} onClick={() => toggleSection('approval')} />
                    </div>
                </div>

                {format === 'PPT' && (
                    <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                        <div className="p-3 bg-purple-50 border border-purple-100 rounded-lg flex gap-3 items-start">
                            <Sparkles size={16} className="text-purple-600 shrink-0 mt-0.5" />
                            <p className="text-[11px] text-purple-700 leading-relaxed font-medium">
                                AI sẽ tự động phân tích các phân tích chiến lược (SWOT, Market) để tạo ra các slide tổng kết, ghi chú thuyết trình và đề xuất hành động tối ưu cho buổi họp Stakeholder.
                            </p>
                        </div>
                    </div>
                )}

                {/* Footer Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                    <button 
                        onClick={onClose}
                        className="px-6 py-2.5 text-slate-600 hover:bg-slate-100 rounded-lg font-bold text-sm transition-colors"
                    >
                        Hủy
                    </button>
                    <button 
                        onClick={handleDownload}
                        disabled={isExporting}
                        className={`px-8 py-2.5 rounded-lg font-bold text-sm shadow-md transition-all flex items-center gap-2 
                            ${format === 'PPT' ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-purple-100' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-100'}
                            ${isExporting ? 'opacity-70 cursor-not-allowed' : 'active:scale-95'}`}
                    >
                        {isExporting ? (
                            <>
                                {format === 'PPT' ? (
                                    <>
                                        <Cpu size={18} className="animate-pulse text-purple-200" />
                                        <span className="animate-in fade-in duration-300">
                                            {aiSteps[aiStep]}
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        Đang xử lý...
                                    </>
                                )}
                            </>
                        ) : (
                            <>
                                {format === 'PPT' && <Sparkles size={18} fill="white" />}
                                {format !== 'PPT' && <Download size={18} />}
                                {format === 'PPT' ? 'AI Generate Slides' : 'Tải xuống báo cáo'}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

const SectionToggle: React.FC<{ label: string; isActive: boolean; onClick: () => void }> = ({ label, isActive, onClick }) => (
    <button 
        onClick={onClick}
        className="flex items-center gap-3 text-left group"
    >
        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${isActive ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 bg-white group-hover:border-blue-400'}`}>
            {isActive && <Check size={12} strokeWidth={4} />}
        </div>
        <span className={`text-sm font-medium ${isActive ? 'text-slate-800' : 'text-slate-500 group-hover:text-slate-700'}`}>{label}</span>
    </button>
);

export default ExportModal;