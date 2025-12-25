import React, { useState, useRef, useEffect } from 'react';
import { X, Check, ChevronDown, AlertCircle, Calendar } from 'lucide-react';
import { AccountPlan } from '../types';
import { MOCK_COMPANIES } from './CompanyList';

interface PlanWizardProps {
    onClose: () => void;
    onSave: (plan: AccountPlan) => void;
}

const STEPS = ['General Info', 'Objectives', 'Resources'];

const PlanWizard: React.FC<PlanWizardProps> = ({ onClose, onSave }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    
    // Form State
    const [formData, setFormData] = useState({
        accountName: '',
        companyId: '',
        companyName: '',
        startDate: '',
        endDate: '',
        description: '',
        revenue: '',
    });

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowCompanyDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user types
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handleRevenueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Remove existing dots and any non-digit characters
        const rawValue = e.target.value.replace(/\./g, '').replace(/\D/g, '');
        
        // Format with dots as thousand separators
        const formattedValue = rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        
        handleInputChange('revenue', formattedValue);
    };

    const handleCompanySelect = (company: typeof MOCK_COMPANIES[0]) => {
        setFormData(prev => ({
            ...prev,
            companyName: company.name,
            companyId: company.id
        }));
        setShowCompanyDropdown(false);
        setErrors(prev => ({ ...prev, companyName: '' }));
    };

    const filteredCompanies = MOCK_COMPANIES.filter(c => 
        c.name.toLowerCase().includes(formData.companyName.toLowerCase())
    );

    const validateStep = (step: number) => {
        const newErrors: Record<string, string> = {};
        let isValid = true;

        if (step === 0) {
            if (!formData.accountName.trim()) {
                newErrors.accountName = 'Plan name is required';
                isValid = false;
            }
            if (!formData.companyId) {
                newErrors.companyName = 'Please select a company from the list';
                isValid = false;
            }
            if (!formData.startDate) {
                newErrors.startDate = 'Start date is required';
                isValid = false;
            }
            if (!formData.endDate) {
                newErrors.endDate = 'End date is required';
                isValid = false;
            }
            if (formData.startDate && formData.endDate && new Date(formData.startDate) > new Date(formData.endDate)) {
                newErrors.endDate = 'End date must be after start date';
                isValid = false;
            }
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleNext = () => {
        if (currentStep < STEPS.length - 1) {
            if (validateStep(currentStep)) {
                setCurrentStep(prev => prev + 1);
            }
        } else {
            // Determine fiscal year from end date or default
            let fiscalYear = 'FY2024';
            if (formData.endDate) {
                const year = new Date(formData.endDate).getFullYear();
                fiscalYear = `FY${year}`;
            }

            // Find selected company details if any
            const selectedCompany = MOCK_COMPANIES.find(c => c.id === formData.companyId);

            // Create the new plan object
            const newPlan: AccountPlan = {
                id: `new-${Date.now()}`,
                accountName: formData.accountName || 'New Account Plan',
                companyId: formData.companyId, // Should be valid now
                companyName: formData.companyName,
                companySegment: selectedCompany?.segment,
                fiscalYear: fiscalYear,
                startDate: formData.startDate,
                endDate: formData.endDate,
                owner: 'John Doe', // Default to current user
                status: 'Draft',
                progress: 0,
                industry: selectedCompany?.industry || 'Technology', // Use company industry or default
                revenue: parseFloat(formData.revenue.replace(/\./g, '')) || 0, // Remove dots before parsing
                winRate: 0,
                isNew: true, // Mark as new so dashboard shows empty states
                // Auto-fill details from company if available
                taxCode: selectedCompany?.taxCode,
                legalRepresentative: selectedCompany?.legalRepresentative,
                location: selectedCompany?.address
            };
            
            // Trigger save and navigation in parent
            onSave(newPlan);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Create Account Plan</h2>
                        <p className="text-sm text-slate-500 mt-1">Define your strategy for the fiscal year</p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <X size={24} />
                    </button>
                </div>

                {/* Steps Indicator */}
                <div className="px-8 py-4 bg-slate-50/50 border-b border-slate-100">
                    <div className="flex items-center justify-between">
                        {STEPS.map((step, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-all
                                    ${idx === currentStep ? 'border-blue-600 bg-blue-600 text-white' : 
                                      idx < currentStep ? 'border-green-500 bg-green-500 text-white' : 
                                      'border-slate-300 text-slate-400'}`}>
                                    {idx < currentStep ? <Check size={16} /> : idx + 1}
                                </div>
                                <span className={`text-sm font-medium ${idx === currentStep ? 'text-blue-900' : 'text-slate-500'}`}>
                                    {step}
                                </span>
                                {idx < STEPS.length - 1 && (
                                    <div className="w-12 h-0.5 bg-slate-200 mx-4 hidden sm:block"></div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Body */}
                <div className="p-8 flex-1 overflow-y-auto">
                    {currentStep === 0 && (
                        <div className="space-y-4">
                            {/* Plan Name - Full Width */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Plan Name <span className="text-red-500">*</span></label>
                                <input 
                                    type="text" 
                                    value={formData.accountName}
                                    onChange={(e) => handleInputChange('accountName', e.target.value)}
                                    className={`w-full px-3 py-2 border bg-white text-slate-900 rounded-[6px] focus:ring-2 focus:ring-blue-500 outline-none placeholder-slate-400 ${errors.accountName ? 'border-red-300 focus:ring-red-200' : 'border-neutral-300'}`}
                                    placeholder="e.g. Global Expansion 2024" 
                                />
                                {errors.accountName && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.accountName}</p>}
                            </div>

                            {/* Company Name - Full Width with Dropdown */}
                            <div className="space-y-2" ref={dropdownRef}>
                                <label className="text-sm font-medium text-slate-700">Company Name <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        value={formData.companyName}
                                        onChange={(e) => {
                                            handleInputChange('companyName', e.target.value);
                                            setShowCompanyDropdown(true);
                                            // Reset ID if user types something new, until they select
                                            if (formData.companyId) setFormData(prev => ({...prev, companyId: ''}));
                                        }}
                                        onFocus={() => setShowCompanyDropdown(true)}
                                        className={`w-full px-3 py-2 border bg-white text-slate-900 rounded-[6px] focus:ring-2 focus:ring-blue-500 outline-none placeholder-slate-400 ${errors.companyName ? 'border-red-300 focus:ring-red-200' : 'border-neutral-300'}`}
                                        placeholder="e.g. Acme Corp" 
                                    />
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                                    
                                    {showCompanyDropdown && (
                                        <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                            {filteredCompanies.length > 0 ? (
                                                filteredCompanies.map(company => (
                                                    <button
                                                        key={company.id}
                                                        onClick={() => handleCompanySelect(company)}
                                                        className="w-full text-left px-4 py-2 hover:bg-slate-50 text-sm text-slate-700 flex flex-col border-b border-slate-50 last:border-0 transition-colors"
                                                    >
                                                        <span className="font-medium text-slate-900">{company.name}</span>
                                                        <span className="text-xs text-slate-500">{company.segment} • {company.industry}</span>
                                                    </button>
                                                ))
                                            ) : (
                                                <div className="px-4 py-3 text-sm text-slate-500 text-center">
                                                    No companies found. 
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                                {errors.companyName && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.companyName}</p>}
                            </div>

                            {/* Start Date & End Date - 2 Cols */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Start Date <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                                        <input 
                                            type="date"
                                            value={formData.startDate}
                                            onChange={(e) => handleInputChange('startDate', e.target.value)}
                                            onClick={(e) => e.currentTarget.showPicker && e.currentTarget.showPicker()}
                                            className={`w-full pl-10 pr-3 py-2 border bg-white text-slate-900 rounded-[6px] focus:ring-2 focus:ring-blue-500 outline-none ${errors.startDate ? 'border-red-300 focus:ring-red-200' : 'border-neutral-300'}`}
                                        />
                                    </div>
                                    {errors.startDate && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.startDate}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">End Date <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                                        <input 
                                            type="date"
                                            value={formData.endDate}
                                            onChange={(e) => handleInputChange('endDate', e.target.value)}
                                            onClick={(e) => e.currentTarget.showPicker && e.currentTarget.showPicker()}
                                            className={`w-full pl-10 pr-3 py-2 border bg-white text-slate-900 rounded-[6px] focus:ring-2 focus:ring-blue-500 outline-none ${errors.endDate ? 'border-red-300 focus:ring-red-200' : 'border-neutral-300'}`}
                                        />
                                    </div>
                                    {errors.endDate && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.endDate}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Description</label>
                                <textarea 
                                    value={formData.description}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                    className="w-full px-3 py-2 border border-neutral-300 bg-white text-slate-900 rounded-[6px] focus:ring-2 focus:ring-blue-500 outline-none h-32 placeholder-slate-400" 
                                    placeholder="Brief overview of the account status..."
                                ></textarea>
                            </div>
                        </div>
                    )}
                    
                    {currentStep === 1 && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Revenue Goal</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                                    <input 
                                        type="text" 
                                        value={formData.revenue}
                                        onChange={handleRevenueChange}
                                        className="w-full pl-8 pr-3 py-3 border border-neutral-300 bg-white text-slate-900 rounded-[6px] focus:ring-2 focus:ring-blue-500 outline-none placeholder-slate-400 text-lg font-medium" 
                                        placeholder="0" 
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Strategic Focus</label>
                                <div className="flex gap-2">
                                    {['Expansion', 'Retention', 'New Logo', 'Partnership'].map(tag => (
                                        <button key={tag} className="px-4 py-2 rounded-full border border-slate-200 hover:border-blue-500 hover:text-blue-600 text-slate-600 text-sm bg-white">
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div className="space-y-4">
                             <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-4">
                                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">JD</div>
                                <div>
                                    <p className="font-medium text-slate-800">John Doe (You)</p>
                                    <p className="text-xs text-slate-500">Account Owner</p>
                                </div>
                             </div>
                             <button className="text-blue-600 text-sm font-medium hover:underline">+ Add Team Member</button>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-8 py-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50 rounded-b-2xl">
                    <button 
                        onClick={onClose}
                        className="px-5 py-2 text-slate-600 font-medium hover:bg-slate-200 rounded-[6px] transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleNext}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-[6px] shadow-md shadow-blue-200 transition-all flex items-center gap-2"
                    >
                        {currentStep === STEPS.length - 1 ? 'Create Plan' : 'Next Step'}
                        {currentStep < STEPS.length - 1 && <Check size={16} className="hidden" />} 
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PlanWizard;